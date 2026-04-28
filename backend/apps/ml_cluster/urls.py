from django.urls import path
from .views import obtener_segmentacion, obtener_estrategico

urlpatterns = [
    path('clientes/', obtener_segmentacion),
    path('estrategico/', obtener_estrategico),
]
