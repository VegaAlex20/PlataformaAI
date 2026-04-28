import pandas as pd
import snowflake.connector
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

from django.http import JsonResponse


def obtener_segmentacion(request):
    try:
        # ===== PARAMETROS =====
        fecha_inicio = request.GET.get("fecha_inicio")
        fecha_fin = request.GET.get("fecha_fin")

        # ===== CONEXIÓN =====
        conn = snowflake.connector.connect(
            account="MDSEUEL-IM70034",
            user="USR_DBT_PROYECTO_BI_TRANSPORTE_V2",
            password="TuClaveUnica#20261",
            warehouse="WH_PROYECTO_BI_TRANSPORTE_V2",
            database="PROYECTO_BI_TRANSPORTE_V2",
            schema="DWH_DEV",
            role="ROLE_DBT_PROYECTO_BI_TRANSPORTE_V2"
        )

        # ===== FILTRO POR FECHA (CORREGIDO) =====
        where_clause = ""
        if fecha_inicio and fecha_fin:
            where_clause = f"""
            WHERE TO_DATE(f.ID_FECHA_REGISTRO_ENVIO::VARCHAR, 'YYYYMMDD')
            BETWEEN '{fecha_inicio}' AND '{fecha_fin}'
            """

        # ===== QUERY =====
        query = f"""
        SELECT
            f.ID_CLIENTE,
            COUNT(*) AS TOTAL_ENVIOS,
            SUM(f.MONTO_FACTURADO_BOB) AS GASTO_TOTAL,
            SUM(f.PESO_ENVIO_KG) AS PESO_TOTAL,
            SUM(f.VALOR_DECLARADO_BOB) AS VALOR_TOTAL,
            SUM(f.DEVUELTO_FLAG) AS DEVOLUCIONES,
            AVG(f.TIEMPO_CICLO_HORAS) AS TIEMPO_PROMEDIO
        FROM PROYECTO_BI_TRANSPORTE_V2.DWH_DEV.FACT_ENVIO f
        {where_clause}
        GROUP BY f.ID_CLIENTE
        """

        df = pd.read_sql(query, conn)
        conn.close()

        if df.empty:
            return JsonResponse({"error": "No hay datos para ese rango"}, status=404)

        df = df.fillna(0)

        # ===== MACHINE LEARNING =====
        X = df.drop(columns=["ID_CLIENTE"])

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        kmeans = KMeans(n_clusters=4, random_state=42)
        df["cluster"] = kmeans.fit_predict(X_scaled)

        # ===== SEGMENTACIÓN INTELIGENTE =====
        resumen = df.groupby("cluster").mean()

        def nombrar_cluster(row):
            if row["TOTAL_ENVIOS"] > 100:
                return "VIP / Grandes Clientes"
            elif row["TOTAL_ENVIOS"] > 30:
                return "Frecuentes"
            else:
                return "Regulares"

        resumen["SEGMENTO"] = resumen.apply(nombrar_cluster, axis=1)

        mapa = resumen["SEGMENTO"].to_dict()
        df["SEGMENTO"] = df["cluster"].map(mapa)

        # ===== KPIs ESTRATÉGICOS =====
        kpis = {
            "total_clientes": int(len(df)),
            "gasto_total": float(df["GASTO_TOTAL"].sum()),
            "envios_totales": int(df["TOTAL_ENVIOS"].sum()),
            "promedio_gasto": float(df["GASTO_TOTAL"].mean()),
            "ticket_promedio": float(df["GASTO_TOTAL"].sum() / df["TOTAL_ENVIOS"].sum())
        }

        # ===== SEGMENTACIÓN =====
        clientes_segmento = df["SEGMENTO"].value_counts().to_dict()

        gasto_segmento = df.groupby("SEGMENTO")["GASTO_TOTAL"].mean().to_dict()

        envios_segmento = df.groupby(
            "SEGMENTO")["TOTAL_ENVIOS"].mean().to_dict()

        devoluciones_segmento = df.groupby(
            "SEGMENTO")["DEVOLUCIONES"].mean().to_dict()

        # ===== TOP CLIENTES =====
        top_clientes = df.sort_values(
            by="GASTO_TOTAL", ascending=False).head(10)

        top_clientes_list = top_clientes[[
            "ID_CLIENTE",
            "SEGMENTO",
            "GASTO_TOTAL",
            "TOTAL_ENVIOS",
            "DEVOLUCIONES"
        ]].to_dict(orient="records")

        # ===== RESPUESTA COMPLETA =====
        return JsonResponse({
            "kpis": kpis,
            "segmentos": clientes_segmento,
            "gasto_promedio": gasto_segmento,
            "envios_promedio": envios_segmento,
            "devoluciones_promedio": devoluciones_segmento,
            "top_clientes": top_clientes_list
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def obtener_estrategico(request):
    try:
        conn = snowflake.connector.connect(
            account="MDSEUEL-IM70034",
            user="USR_DBT_PROYECTO_BI_TRANSPORTE_V2",
            password="TuClaveUnica#20261",
            warehouse="WH_PROYECTO_BI_TRANSPORTE_V2",
            database="PROYECTO_BI_TRANSPORTE_V2",
            schema="DWH_DEV",
            role="ROLE_DBT_PROYECTO_BI_TRANSPORTE_V2"
        )

        query = """
        SELECT
            f.ID_CLIENTE,
            f.MONTO_FACTURADO_BOB,
            f.ID_FECHA_REGISTRO_ENVIO
        FROM PROYECTO_BI_TRANSPORTE_V2.DWH_DEV.FACT_ENVIO f
        LIMIT 5000
        """

        df = pd.read_sql(query, conn)
        conn.close()

        df = df.fillna(0)

        # ===== SIMULAR SEGMENTOS =====
        df["SEGMENTO"] = df["ID_CLIENTE"] % 3
        df["SEGMENTO"] = df["SEGMENTO"].map({
            0: "VIP",
            1: "Frecuentes",
            2: "Regulares"
        })

        # ===== DISTRIBUCIÓN =====
        distribucion = (df["SEGMENTO"].value_counts(
            normalize=True) * 100).to_dict()

        # ===== INGRESOS =====
        ingresos = df.groupby("SEGMENTO")[
            "MONTO_FACTURADO_BOB"].sum().to_dict()

        # ===== EVOLUCIÓN =====
        df["MES"] = df["ID_FECHA_REGISTRO_ENVIO"].astype(str).str[:6]

        evolucion = df.groupby(["MES", "SEGMENTO"])[
            "MONTO_FACTURADO_BOB"].sum().reset_index()

        evolucion_list = evolucion.to_dict(orient="records")

        return JsonResponse({
            "distribucion": distribucion,
            "ingresos": ingresos,
            "evolucion": evolucion_list
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
