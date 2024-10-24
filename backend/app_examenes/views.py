from rest_framework.decorators import api_view, action 
from rest_framework.response import Response
from rest_framework import status
from .models import Examen, Pregunta, Opcion, Resultado, Usuario
from .serializers import ExamenSerializer, PreguntaSerializer, OpcionSerializer, ResultadoSerializer, UsuarioSerializer
from rest_framework import viewsets  # Importa viewsets
from rest_framework.views import APIView
from datetime import timedelta
import re
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated





# Viewset para el modelo Examen
class ExamenViewSet(viewsets.ModelViewSet):
    queryset = Examen.objects.all().order_by('id') 
    serializer_class = ExamenSerializer

    # Acción personalizada para obtener las preguntas de un examen
    @action(detail=True, methods=['get'])
    def preguntas(self, request, pk=None):
        examen = self.get_object()  # Obtener el examen específico
        preguntas = Pregunta.objects.filter(examen=examen)

        preguntas = preguntas.order_by('id')  

        serializer = PreguntaSerializer(preguntas, many=True)
        return Response(serializer.data)


# Viewset para el modelo Pregunta
class PreguntaViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer

# Viewset para el modelo Opcion
class OpcionViewSet(viewsets.ModelViewSet):
    queryset = Opcion.objects.all()
    serializer_class = OpcionSerializer


# Viewset para el modelo Resultado
class ResultadoViewSet(viewsets.ModelViewSet):
    queryset = Resultado.objects.all()
    serializer_class = ResultadoSerializer

    

class ExamenResultadosView(APIView):
    def get(self, request, examen_id):
        try:
            examen = Examen.objects.get(id=examen_id)
            resultados = Resultado.objects.filter(examen=examen)

            data = []

            for resultado in resultados:
                preguntas_respuestas = []

                for pregunta_id, opcion_id in resultado.respuestas.items():
                    try:
                        pregunta = Pregunta.objects.get(id=pregunta_id, examen=examen)
                        opciones = Opcion.objects.filter(pregunta=pregunta)

                        opciones_data = [
                            {
                                'id': opcion.id,
                                'texto': opcion.texto,
                                'correcta': opcion.es_correcta,
                                'seleccionada': opcion.id == opcion_id
                            }
                            for opcion in opciones
                        ]

                        correcta = any(opcion['correcta'] and opcion['seleccionada'] for opcion in opciones_data)

                        preguntas_respuestas.append({
                            'id': pregunta.id,
                            'texto': pregunta.texto,
                            'correcta': correcta,
                            'opciones': opciones_data,
                            'explicacion': pregunta.explicacion 
                        })
                    except Pregunta.DoesNotExist:
                        continue

                data.append({
                    'puntuacion': resultado.puntuacion,
                    'total_preguntas': examen.preguntas.count(),
                    'fecha_realizacion': resultado.fecha_realizacion,
                    'tiempo_empleado': resultado.tiempo_empleado,
                    'preguntas': preguntas_respuestas
                })

            return Response(data, status=status.HTTP_200_OK)

        except Examen.DoesNotExist:
            return Response({'error': 'Examen no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, examen_id):
        print("DATOS ENVIADOS: ", request.data)
        
        try:
            examen = Examen.objects.get(id=examen_id)
        except Examen.DoesNotExist:
            return Response({'error': 'Examen no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los datos del cuerpo de la solicitud (respuestas y tiempo empleado)
        respuestas = request.data.get('respuestas')
        tiempo_empleado = request.data.get('tiempo_empleado')

        if respuestas is None or tiempo_empleado is None:
            return Response({'error': 'Datos incompletos'}, status=status.HTTP_400_BAD_REQUEST)

        # Inicializar contador de respuestas correctas
        preguntas_correctas = 0

        # Procesar cada respuesta
        for pregunta_id, opcion_id in respuestas.items():
            if opcion_id is None:  # Si la respuesta es null (pregunta no contestada)
                continue  # No hacer nada, solo saltar esta iteración
            
            try:
                # Verificar que la pregunta pertenezca al examen
                pregunta = Pregunta.objects.get(id=pregunta_id, examen=examen)
                
                # Verificar que la opción pertenezca a la pregunta
                opcion = Opcion.objects.get(id=opcion_id, pregunta=pregunta)

                # Si la opción es correcta, incrementar el contador
                if opcion.es_correcta:
                    preguntas_correctas += 1

            except (Pregunta.DoesNotExist, Opcion.DoesNotExist):
                return Response({'error': 'Pregunta o opción no válida'}, status=status.HTTP_400_BAD_REQUEST)

        # Guardar el resultado en la base de datos con la puntuacion como número de respuestas correctas
        try:
            # Convertir el tiempo empleado a un intervalo de tiempo (timedelta)
            tiempo_empleado_timedelta = timedelta(seconds=tiempo_empleado)

            resultado = Resultado.objects.create(
                examen=examen,
                puntuacion=preguntas_correctas,  # Número de preguntas correctas como puntuacion
                tiempo_empleado=tiempo_empleado_timedelta,  # Guardar el tiempo como timedelta
                respuestas=respuestas  # Guardar las respuestas en formato JSON
            )

            return Response({
                'mensaje': 'Resultado guardado correctamente',
                'preguntas_correctas': preguntas_correctas,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        



class UploadTxtExamenView(APIView):

    def post(self, request):
        # Obtener el archivo .txt desde la solicitud
        print("REQUEST FILES: ", request.FILES)
        archivo_txt = request.FILES.get('archivo_txt')  

        if not archivo_txt:
            return Response({'error': 'No se adjuntó ningún archivo'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Leer el contenido del archivo
            contenido = archivo_txt.read().decode('utf-8')
            print("CONTENIDO DEL ARCHIVO: ", contenido)  # Agrega este log
            # Procesar el contenido del archivo y crear el examen y preguntas
            examen, preguntas_creadas = self.procesar_contenido_txt(contenido)

            return Response({'mensaje': 'Examen y preguntas creados correctamente'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Manejo de excepciones
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def procesar_contenido_txt(self, contenido):
        # Regex para extraer la información del examen y preguntas
        examen_regex = re.compile(r'Nombre del examen:\s*(.*)\nDescripción:\s*(.*)\n', re.MULTILINE)
        pregunta_regex = re.compile(r'Pregunta:\s*(.*?)\n((?:[a-z]\)\s*.*?\n)+)(?:Explicación:\s*(.*))?\n?', re.MULTILINE)

        # Extraer el nombre y la descripción del examen
        examen_match = examen_regex.search(contenido)
        if not examen_match:
            raise ValueError('El archivo no tiene la estructura correcta para el examen.')

        nombre_examen = examen_match.group(1).strip()
        descripcion_examen = examen_match.group(2).strip()

        # Crear el examen en la base de datos
        examen = Examen.objects.create(
            nombre=nombre_examen,
            descripcion=descripcion_examen,
            randomizar_preguntas=False,
            randomizar_opciones=False,
            preguntas_por_pagina=5
        )

        # Extraer todas las preguntas
        preguntas_match = pregunta_regex.findall(contenido)
        if not preguntas_match:
            raise ValueError('No se encontraron preguntas en el archivo.')

        # Procesar cada pregunta y sus opciones
        for pregunta_texto, opciones_texto, explicacion in preguntas_match:
            # Crear la pregunta en la base de datos con o sin explicación
            pregunta = Pregunta.objects.create(
                texto=pregunta_texto.strip(),
                examen=examen,
                explicacion=explicacion.strip() if explicacion else ''
            )

            # Limpiar las opciones eliminando líneas vacías y procesando las respuestas correctas
            opciones = [opcion.strip() for opcion in opciones_texto.strip().splitlines() if opcion.strip()]

            print("OPCIONES: ", opciones)  # Para depurar

            for opcion_texto in opciones:
                # Buscar el asterisco (*) al final para identificar si es la respuesta correcta
                es_correcta = opcion_texto.endswith('*')
                opcion_texto_limpio = opcion_texto.replace('*', '').strip()

                # Eliminar el prefijo "a) ", "b) ", etc., asegurando que se capturen más de cuatro opciones
                if len(opcion_texto_limpio) > 3 and opcion_texto_limpio[1] == ')':
                    opcion_texto_limpio = opcion_texto_limpio[3:].strip()

                # Crear la opción de respuesta
                Opcion.objects.create(
                    texto=opcion_texto_limpio,
                    pregunta=pregunta,
                    es_correcta=es_correcta
                )

        return examen, preguntas_match


## Vista de registro de usuario
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        # Determinar el rol y configurar los campos
        es_profesor = data.get('role') == 'profesor'
        es_alumno = data.get('role') == 'alumno'

        try:
            user = Usuario.objects.create(
                username=data['username'],
                password=make_password(data['password']),
                es_profesor=es_profesor,
                es_alumno=es_alumno,
                is_staff=es_profesor,  # Si es profesor, darle permisos de staff
            )

            serializer = UsuarioSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Vista de login que devuelve el token JWT
@api_view(['POST'])
def login_view(request):
    from django.contrib.auth import authenticate
    user = authenticate(username=request.data['username'], password=request.data['password'])

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'es_profesor': user.es_profesor,
            'es_alumno': user.es_alumno
        })
    else:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    
    
class UsuarioViewSet(viewsets.ModelViewSet):

    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    # Definir permisos basados en la acción
    def get_permissions(self):
        if self.action in ['create', 'list']:  # Permitir que cualquiera acceda a la creación o listado de usuarios
            self.permission_classes = [AllowAny]
        else:  # Para otras acciones (actualizar, eliminar, etc.), requerir autenticación
            self.permission_classes = [IsAuthenticated]
        return super(UsuarioViewSet, self).get_permissions()

    # Sobrescribir el método `perform_create` para gestionar la creación del usuario.
    def perform_create(self, serializer):
        # Crear el usuario
        serializer.save()

    # Opcionalmente, puedes filtrar usuarios por rol si lo necesitas
    def get_queryset(self):
        queryset = Usuario.objects.all()

        # Filtrar por profesor, alumno o usuarios independientes (si es necesario)
        role = self.request.query_params.get('role')
        if role == 'profesor':
            queryset = queryset.filter(es_profesor=True)
        elif role == 'alumno':
            queryset = queryset.filter(es_alumno=True)

        return queryset