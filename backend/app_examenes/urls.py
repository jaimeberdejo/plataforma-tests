from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ExamenViewSet, PreguntaViewSet, OpcionViewSet, 
    ResultadoViewSet, ExamenResultadosView, UploadTxtExamenView,
    RegisterView, LoginView, UsuarioViewSet, AlumnoViewSet, ProfesorViewSet
)

# Definir el router para las rutas de la API
router = DefaultRouter()
router.register(r'examenes', ExamenViewSet)
router.register(r'preguntas', PreguntaViewSet)
router.register(r'opciones', OpcionViewSet)
router.register(r'resultados', ResultadoViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'alumnos', AlumnoViewSet, basename='alumno')   # Cambia a 'alumnos'
router.register(r'profesores', ProfesorViewSet, basename='profesor')  # Mantén 'profesores' para ProfesorViewSet

urlpatterns = [
    path('api/', include(router.urls)),  # Rutas de la API
    path('api-auth/', include('rest_framework.urls')),  # Autenticación de API
    path('api/examenes/<int:examen_id>/resultados/', ExamenResultadosView.as_view(), name='examen-resultados'),
    path('api/uploadtxt/', UploadTxtExamenView.as_view(), name='upload-txt-examen'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]
