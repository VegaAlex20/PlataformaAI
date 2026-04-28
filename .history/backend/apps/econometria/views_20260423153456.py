import pandas as pd
import numpy as np
import statsmodels.api as sm
from django.http import JsonResponse
import snowflake.connector


def cargar_datos():
    conn = snowflake.connector.connect(
        account="MDSEUEL-IM70034",
        user="USR_DBT_PROYECTO_BI_TRANSPORTE_V2",
        password="TuClaveUnica#20261",
        warehouse="WH_PROYECTO_BI_TRANSPORTE_V2",
        database="PROYECTO_BI_TRANSPORTE_V2",
        schema="DWH_DEV",
        role="ROLE_DBT_PROYECTO_BI_TRANSPORTE_V2",
    )

    query = """
    SELECT
        f.MONTO_FACTURADO_BOB,
        f.PESO_ENVIO_KG,
        f.CUMPLE_SLA_RECOJO_FLAG,
        f.DEVUELTO_FLAG,
        r.DISTANCIA_KM,
        r.CIUDAD_DESTINO,
        c.SEGMENTO,
        t.PRECIO_UNITARIO_BOB
    FROM FACT_ENVIO f
    LEFT JOIN DIM_RUTA r ON f.ID_RUTA = r.ID_RUTA
    LEFT JOIN DIM_CLIENTE c ON f.ID_CLIENTE = c.ID_CLIENTE
    LEFT JOIN DIM_TARIFA t ON f.ID_TARIFA_DETALLE = t.ID_TARIFA_DETALLE
    WHERE f.MONTO_FACTURADO_BOB IS NOT NULL
    """

    df = pd.read_sql(query, conn)
    conn.close()
    return df


def entrenar_modelo():
    df = cargar_datos()

    df_original = df.copy()  # 🔥 ESTE ES EL FIX

    df["LOG_MONTO"] = np.log(df["MONTO_FACTURADO_BOB"] + 1)
    df["LOG_PESO"] = np.log(df["PESO_ENVIO_KG"] + 1)
    df["LOG_DISTANCIA"] = np.log(df["DISTANCIA_KM"] + 1)

    df = pd.get_dummies(df, columns=["SEGMENTO"], drop_first=True)
    df = pd.get_dummies(df, columns=["CIUDAD_DESTINO"], drop_first=True)

    variables = [
        "LOG_PESO",
        "LOG_DISTANCIA",
        "PRECIO_UNITARIO_BOB",
        "CUMPLE_SLA_RECOJO_FLAG",
        "DEVUELTO_FLAG"
    ]

    variables += [c for c in df.columns if "SEGMENTO_" in c]
    variables += [c for c in df.columns if "CIUDAD_DESTINO_" in c]

    df_final = df[["LOG_MONTO"] + variables].dropna()

    X = df_final[variables].astype(float)
    y = df_final["LOG_MONTO"].astype(float)

    X = sm.add_constant(X)

    modelo = sm.OLS(y, X).fit()

    return modelo, X.columns, df_original  # 🔥 DEVOLVEMOS EL ORIGINAL


modelo, columnas_modelo, df_global = entrenar_modelo()


def predecir(request):
    try:
        peso = float(request.GET.get("peso", 50))
        distancia = float(request.GET.get("distancia", 700))
        precio = float(request.GET.get("precio", 800))
    except:
        return JsonResponse({"error": "parámetros inválidos"}, status=400)

    data = {
        "LOG_PESO": np.log(peso + 1),
        "LOG_DISTANCIA": np.log(distancia + 1),
        "PRECIO_UNITARIO_BOB": precio,
        "CUMPLE_SLA_RECOJO_FLAG": 1,
        "DEVUELTO_FLAG": 0,
    }

    df_input = pd.DataFrame([data])

    for col in columnas_modelo:
        if col not in df_input.columns:
            df_input[col] = 0

    df_input = df_input[columnas_modelo]

    pred_log = modelo.predict(df_input)[0]
    pred_real = np.exp(pred_log) - 1  # 🔥 CORRECCIÓN IMPORTANTE

    return JsonResponse({"ingreso_estimado": float(pred_real)})


def resumen(request):
    try:
        seg = df_global.groupby("SEGMENTO")["MONTO_FACTURADO_BOB"] \
            .mean().sort_values(ascending=False)

        ciudad = df_global.groupby("CIUDAD_DESTINO")["MONTO_FACTURADO_BOB"] \
            .mean().sort_values(ascending=False)

        return JsonResponse({
            "ingreso_promedio": float(df_global["MONTO_FACTURADO_BOB"].mean()),
            "por_segmento": seg.to_dict(),
            "por_ciudad": ciudad.to_dict(),
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
