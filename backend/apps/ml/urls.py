from django.urls import path
from .views import predecir_riesgo, viajes_operativos, analisis_tactico

urlpatterns = [
    path("predecir/", predecir_riesgo),
    path("viajes/", viajes_operativos),
    path("analisis-tactico/", analisis_tactico),
]
