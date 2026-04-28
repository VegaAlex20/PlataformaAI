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

        # ===== FILTRO DINÁMICO =====
        where_clause = ""
        if fecha_inicio and fecha_fin:
            where_clause = f"""
            WHERE f.FECHA_REGISTRO_ENVIO BETWEEN '{fecha_inicio}' AND '{fecha_fin}'
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

        df = df.fillna(0)

        # ===== ML =====
        X = df.drop(columns=["ID_CLIENTE"])

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        kmeans = KMeans(n_clusters=4, random_state=42)
        df["cluster"] = kmeans.fit_predict(X_scaled)

        # ===== SEGMENTACIÓN =====
        resumen = df.groupby("cluster").mean()

        def nombrar_cluster(row):
            if row["TOTAL_ENVIOS"] > 100:
                return "VIP"
            elif row["TOTAL_ENVIOS"] > 30:
                return "Frecuentes"
            else:
                return "Regulares"

        resumen["SEGMENTO"] = resumen.apply(nombrar_cluster, axis=1)

        mapa = resumen["SEGMENTO"].to_dict()
        df["SEGMENTO"] = df["cluster"].map(mapa)

        # ===== KPIs =====
        kpis = {
            "total_clientes": int(len(df)),
            "gasto_total": float(df["GASTO_TOTAL"].sum()),
            "envios_totales": int(df["TOTAL_ENVIOS"].sum()),
            "promedio_gasto": float(df["GASTO_TOTAL"].mean())
        }

        # ===== TOP CLIENTES =====
        top_clientes = df.sort_values(by="GASTO_TOTAL", ascending=False).head(10)

        top_clientes_list = top_clientes[[
            "ID_CLIENTE",
            "SEGMENTO",
            "GASTO_TOTAL",
            "TOTAL_ENVIOS"
        ]].to_dict(orient="records")

        # ===== SEGMENTOS =====
        segmentos = df["SEGMENTO"].value_counts().to_dict()

        return JsonResponse({
            "kpis": kpis,
            "segmentos": segmentos,
            "top_clientes": top_clientes_list
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)