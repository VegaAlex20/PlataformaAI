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


# =========================
# 🔥 PREDICCIÓN INDIVIDUAL
# =========================
@csrf_exempt
def predecir_riesgo(request):
    if request.method == "POST":
        data = json.loads(request.body)

        df = pd.DataFrame([{
            "DISTANCIA_KM": data["DISTANCIA_KM"],
            "OCUPACION_PCT": data["OCUPACION_PCT"],
            "COSTO_OPERATIVO_TOTAL_BOB": data["COSTO_OPERATIVO_TOTAL_BOB"],
            "CAPACIDAD_KG": data["CAPACIDAD_KG"],
            "PESO_TOTAL_ASIGNADO_KG": data["PESO_TOTAL_ASIGNADO_KG"],
            "COSTO_COMBUSTIBLE_TOTAL_BOB": data["COSTO_COMBUSTIBLE_TOTAL_BOB"]
        }])

        prob = float(modelo.predict_proba(df)[0][1])

        # 🔥 SCORE MÁS INTELIGENTE (NO FIX 0.5)
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


# =========================
# 🚛 VIAJES OPERATIVOS (INTELIGENTE)
# =========================
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

    # 🔥 predicción
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

    # 🔥 SCORE MEJORADO
    df["riesgo"] = (df["probabilidad"] >= 0.65).astype(int)

    df["alerta"] = pd.cut(
        df["probabilidad"],
        bins=[0, 0.4, 0.65, 0.8, 1],
        labels=["BAJO", "MEDIO", "ALTO", "CRÍTICO"]
    ).astype(str)

    # 🔥 KPI REAL (balanceado)
    total = len(df)
    riesgos = int(df["riesgo"].sum())
    pct = round((riesgos / total) * 100, 2) if total > 0 else 0

    # 🔥 TOP CRÍTICOS REAL
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
        v.DISTANCIA_KM,
        v.OCUPACION_PCT,
        v.COSTO_OPERATIVO_TOTAL_BOB,
        v.CAPACIDAD_KG,
        v.PESO_TOTAL_ASIGNADO_KG,
        v.COSTO_COMBUSTIBLE_TOTAL_BOB
    FROM PROYECTO_BI_TRANSPORTE_V2.DWH_DEV.FACT_VIAJE v
    """

    df = pd.read_sql(query, conn)

    # 🔥 predicción
    X = df[[
        "DISTANCIA_KM",
        "OCUPACION_PCT",
        "COSTO_OPERATIVO_TOTAL_BOB",
        "CAPACIDAD_KG",
        "PESO_TOTAL_ASIGNADO_KG",
        "COSTO_COMBUSTIBLE_TOTAL_BOB"
    ]]

    df["probabilidad"] = modelo.predict_proba(X)[:, 1]
    df["riesgo"] = (df["probabilidad"] >= 0.65).astype(int)

    # =========================
    # 👨‍✈️ TOP CONDUCTORES RIESGO
    # =========================
    conductores = df.groupby("ID_CONDUCTOR").agg({
        "probabilidad": "mean",
        "riesgo": "sum",
        "ID_VIAJE": "count"
    }).reset_index()

    conductores.columns = ["ID_CONDUCTOR",
                           "RIESGO_PROMEDIO", "VIAJES", "CASOS_RIESGO"]

    conductores = conductores.sort_values("RIESGO_PROMEDIO", ascending=False)

    # =========================
    # 🛣 RUTAS RIESGOSAS (SIMPLIFICADO)
    # =========================
    rutas = df.groupby("DISTANCIA_KM").agg({
        "probabilidad": "mean",
        "riesgo": "sum"
    }).reset_index()

    rutas = rutas.sort_values("probabilidad", ascending=False).head(10)

    # =========================
    # 💰 OPTIMIZACIÓN OPERATIVA
    # =========================
    df["costo_total"] = df["COSTO_OPERATIVO_TOTAL_BOB"] + \
        df["COSTO_COMBUSTIBLE_TOTAL_BOB"]

    eficiencia = df.groupby("ID_CONDUCTOR").agg({
        "costo_total": "mean",
        "probabilidad": "mean"
    }).reset_index()

    eficiencia = eficiencia.sort_values("probabilidad", ascending=False)

    return JsonResponse({
        "top_conductores": conductores.head(10).to_dict(orient="records"),
        "top_rutas": rutas.to_dict(orient="records"),
        "eficiencia_operativa": eficiencia.head(10).to_dict(orient="records")
    }, safe=False)
