import joblib
import os
import json
import pandas as pd
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import snowflake.connector

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml/modelo/modelo_riesgo.pkl")

modelo = joblib.load(MODEL_PATH)


@csrf_exempt
def predecir_riesgo(request):
    if request.method == "POST":
        data = json.loads(request.body)

        distancia = float(data["DISTANCIA_KM"])
        ocupacion = float(data["OCUPACION_PCT"])
        capacidad = float(data["CAPACIDAD_KG"])
        peso = float(data["PESO_TOTAL_ASIGNADO_KG"])
        tipo_carga = data.get("TIPO_CARGA", "Normal")
        clima = data.get("CONDICION_CLIMATICA", "Soleado")

        costo_operativo = distancia * 1.5 + peso * 0.05
        costo_combustible = distancia * 0.8

        df = pd.DataFrame([{
            "DISTANCIA_KM": distancia,
            "OCUPACION_PCT": ocupacion,
            "COSTO_OPERATIVO_TOTAL_BOB": costo_operativo,
            "CAPACIDAD_KG": capacidad,
            "PESO_TOTAL_ASIGNADO_KG": peso,
            "COSTO_COMBUSTIBLE_TOTAL_BOB": costo_combustible
        }])

        prob = float(modelo.predict_proba(df)[0][1])
        if tipo_carga == "Fragil":
            prob += 0.05
        elif tipo_carga == "Peligrosa":
            prob += 0.10

        if clima == "Lluvia":
            prob += 0.07
        elif clima == "Tormenta":
            prob += 0.15

        prob = min(prob, 1.0)

        if prob >= 0.80:
            alerta = "CRÍTICO"
        elif prob >= 0.65:
            alerta = "ALTO RIESGO"
        elif prob >= 0.40:
            alerta = "MEDIO"
        else:
            alerta = "BAJO RIESGO"

        return JsonResponse({
            "probabilidad": round(prob, 4),
            "riesgo": int(prob >= 0.65),
            "alerta": alerta
        })


@csrf_exempt
def viajes_operativos(request):
    id_conductor = request.GET.get("id_conductor", None)
    conn = snowflake.connector.connect(
        account="MDSEUEL-IM70034",
        user="USR_DBT_PROYECTO_BI_TRANSPORTE_V2",
        password="TuClaveUnica#20261",
        warehouse="WH_PROYECTO_BI_TRANSPORTE_V2",
        database="PROYECTO_BI_TRANSPORTE_V2",
        role="ROLE_DBT_PROYECTO_BI_TRANSPORTE_V2",
    )

    query = """
    SELECT
        v.ID_VIAJE,
        v.ID_CONDUCTOR,
        v.DISTANCIA_KM,
        v.OCUPACION_PCT,
        v.CAPACIDAD_KG,
        v.PESO_TOTAL_ASIGNADO_KG,
        v.COSTO_OPERATIVO_TOTAL_BOB,
        v.COSTO_COMBUSTIBLE_TOTAL_BOB
    FROM PROYECTO_BI_TRANSPORTE_V2.DWH_DEV.FACT_VIAJE v
    """

    if id_conductor:
        query += f" WHERE v.ID_CONDUCTOR = {id_conductor}"

    df = pd.read_sql(query, conn)

    X = df[[
        "DISTANCIA_KM",
        "OCUPACION_PCT",
        "COSTO_OPERATIVO_TOTAL_BOB",
        "CAPACIDAD_KG",
        "PESO_TOTAL_ASIGNADO_KG",
        "COSTO_COMBUSTIBLE_TOTAL_BOB"
    ]]

    probs = modelo.predict_proba(X)[:, 1]
    df["probabilidad"] = probs

    df["riesgo"] = (df["probabilidad"] >= 0.65).astype(int)

    df["alerta"] = pd.cut(
        df["probabilidad"],
        bins=[0, 0.4, 0.65, 0.8, 1],
        labels=["BAJO", "MEDIO", "ALTO", "CRÍTICO"]
    ).astype(str)

    total = len(df)
    riesgos = int(df["riesgo"].sum())
    pct = round((riesgos / total) * 100, 2) if total > 0 else 0
    top = df.sort_values("probabilidad", ascending=False).head(5)

    return JsonResponse({
        "kpi": {
            "total": total,
            "riesgos": riesgos,
            "porcentaje_riesgo": pct
        },
        "top_alertas": top.to_dict(orient="records"),
        "viajes": df.to_dict(orient="records")
    }, safe=False)


@csrf_exempt
def analisis_tactico(request):

    conn = snowflake.connector.connect(
        account="MDSEUEL-IM70034",
        user="USR_DBT_PROYECTO_BI_TRANSPORTE_V2",
        password="TuClaveUnica#20261",
        warehouse="WH_PROYECTO_BI_TRANSPORTE_V2",
        database="PROYECTO_BI_TRANSPORTE_V2",
        role="ROLE_DBT_PROYECTO_BI_TRANSPORTE_V2",
    )

    query = """
    SELECT
        v.ID_VIAJE,
        v.ID_CONDUCTOR,
        v.ID_VEHICULO,
        v.ID_RUTA,

        v.DISTANCIA_KM,
        v.OCUPACION_PCT,
        v.CAPACIDAD_KG,
        v.PESO_TOTAL_ASIGNADO_KG,

        v.COSTO_OPERATIVO_TOTAL_BOB,
        v.COSTO_COMBUSTIBLE_TOTAL_BOB,

        v.VELOCIDAD_PROMEDIO_KMH,
        v.ALERTAS_CRITICAS_COUNT,

        r.CIUDAD_ORIGEN,
        r.CIUDAD_DESTINO,
        r.CODIGO_RUTA

    FROM PROYECTO_BI_TRANSPORTE_V2.DWH_DEV.FACT_VIAJE v

    LEFT JOIN PROYECTO_BI_TRANSPORTE_V2.DWH_DEV.DIM_RUTA r
        ON v.ID_RUTA = r.ID_RUTA
    """

    df = pd.read_sql(query, conn)

    # FEATURES del modelo (no cambian)
    X = df[[
        "DISTANCIA_KM",
        "OCUPACION_PCT",
        "COSTO_OPERATIVO_TOTAL_BOB",
        "CAPACIDAD_KG",
        "PESO_TOTAL_ASIGNADO_KG",
        "COSTO_COMBUSTIBLE_TOTAL_BOB"
    ]]

    df["probabilidad"] = modelo.predict_proba(X)[:, 1]

    df["categoria"] = pd.cut(
        df["probabilidad"],
        bins=[0, 0.3, 0.6, 0.75, 1],
        labels=["BAJO", "MEDIO", "ALTO", "CRITICO"]
    )

    df["riesgo"] = (df["probabilidad"] >= 0.65).astype(int)

    # 🔥 NUEVO: nombre de ruta real
    df["ruta_nombre"] = df["CIUDAD_ORIGEN"] + " → " + df["CIUDAD_DESTINO"]

    # KPIs
    total = len(df)
    riesgo_pct = round(df["riesgo"].mean() * 100, 2)
    avg_prob = round(df["probabilidad"].mean(), 4)

    # rutas reales (no km)
    rutas = df.groupby(["ID_RUTA", "ruta_nombre"]).agg({
        "probabilidad": "mean"
    }).reset_index()

    rutas = rutas.sort_values("probabilidad", ascending=False).head(10)

    return JsonResponse({
        "kpi": {
            "total_viajes": total,
            "riesgo_pct": riesgo_pct,
            "probabilidad_promedio": avg_prob
        },

        "top_rutas": rutas.to_dict(orient="records"),
        "viajes": df.head(100).to_dict(orient="records")

    }, safe=False)
