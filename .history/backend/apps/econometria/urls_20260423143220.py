# econometria/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("predecir/", views.predecir),
    path("resumen/", views.resumen),
]
