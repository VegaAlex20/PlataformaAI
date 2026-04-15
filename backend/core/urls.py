from django.urls import path, include, re_path
from django.views.static import serve
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import os


def serve_react_frontend(request, path=''):
    return serve(request, path or "index.html", document_root=os.path.join(settings.BASE_DIR, '..', 'frontend', 'build'))


urlpatterns = [
    # URLs de autenticación con Djoser
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    path('admin/', admin.site.urls),
    path("api/", include('apps.ml.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r'^(?:.*)/?$', serve_react_frontend),
]
