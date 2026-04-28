from django.urls import path
from .views import obtener_segmentacion

urlpatterns = [
    path('clientes/', obtener_segmentacion),
]
