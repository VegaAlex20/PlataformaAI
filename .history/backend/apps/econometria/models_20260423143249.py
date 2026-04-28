# econometria/models.py

from django.db import models


class Prediccion(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    peso = models.FloatField()
    distancia = models.FloatField()
    precio = models.FloatField()
    resultado = models.FloatField()

    def __str__(self):
        return f"Prediccion {self.id}"


class ModeloEconometrico(models.Model):
    creado_en = models.DateTimeField(auto_now_add=True)
    r2 = models.FloatField(null=True, blank=True)
    variables = models.JSONField()

    def __str__(self):
        return f"Modelo {self.id} - R2: {self.r2}"
