from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExamenViewSet, PreguntaViewSet, OpcionViewSet, 
    TemaViewSet, ResultadoViewSet, ExamenResultadosView
)

# Definir el router para las rutas de la API
router = DefaultRouter()
router.register(r'examenes', ExamenViewSet)
router.register(r'preguntas', PreguntaViewSet)
router.register(r'opciones', OpcionViewSet)
router.register(r'temas', TemaViewSet)
router.register(r'resultados', ResultadoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),  # Incluye todas las rutas del enrutador
    path('api-auth/', include('rest_framework.urls')),  # Autenticación de API
    path('api/examenes/<int:examen_id>/resultados/', ExamenResultadosView.as_view(), name='examen-resultados'),
]
