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

        # ===== QUERY DINÁMICA =====
        where_clause = ""
        if fecha_inicio and fecha_fin:
            where_clause = f"""
            WHERE f.FECHA_REGISTRO_ENVIO BETWEEN '{fecha_inicio}' AND '{fecha_fin}'
            """

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

        # ===== RESPUESTA =====

        return JsonResponse({
            "clientes_por_segmento": df["SEGMENTO"].value_counts().to_dict(),
            "gasto_promedio": df.groupby("SEGMENTO")["GASTO_TOTAL"].mean().to_dict(),
            "envios_promedio": df.groupby("SEGMENTO")["TOTAL_ENVIOS"].mean().to_dict(),
            "devoluciones_promedio": df.groupby("SEGMENTO")["DEVOLUCIONES"].mean().to_dict(),
            "total_clientes": len(df)
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
