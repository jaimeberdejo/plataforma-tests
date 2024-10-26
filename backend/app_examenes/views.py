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
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404





# Viewset para el modelo Examen
class ExamenViewSet(viewsets.ModelViewSet):
    queryset = Examen.objects.all().order_by('id')
    serializer_class = ExamenSerializer
     
    def get_queryset(self):
            # Obtiene el ID del usuario desde los parámetros de consulta (query params)
        user_id = self.request.query_params.get('user_id')
        if user_id:
            # Filtra los exámenes por el usuario especificado
            return Examen.objects.filter(creado_por_id=user_id).order_by('id')
        # Si no se proporciona user_id, devuelve todos los exámenes
        return Examen.objects.all().order_by('id')

    # Acción personalizada para obtener las preguntas de un examen
    @action(detail=True, methods=['get'])
    def preguntas(self, request, pk=None):
        examen = self.get_object()  # Obtener el examen específico
        preguntas = Pregunta.objects.filter(examen=examen).order_by('id')

        serializer = PreguntaSerializer(preguntas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='examenes-asignados')
    def examenes_asignados(self, request):
        """Listar exámenes asignados a un alumno específico"""
        alumno_id = request.query_params.get('alumno_id')
        if not alumno_id:
            return Response({"error": "ID del alumno requerido"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Filtrar exámenes que tienen el alumno asignado
            examenes = Examen.objects.filter(alumnos_asignados__id=alumno_id)
            serializer = ExamenSerializer(examenes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Examen.DoesNotExist:
            return Response({"error": "No se encontraron exámenes asignados"}, status=status.HTTP_404_NOT_FOUND)
    


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

                # Añadir examen y usuario en la respuesta
                data.append({
                    'puntuacion': resultado.puntuacion,
                    'total_preguntas': examen.preguntas.count(),
                    'fecha_realizacion': resultado.fecha_realizacion,
                    'tiempo_empleado': resultado.tiempo_empleado,
                    'examen': {
                        'id': examen.id,
                        'nombre': examen.nombre,
                    },
                    'usuario': {
                        'id': resultado.usuario.id,
                        'nombre': resultado.usuario.username,
                    },
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

        respuestas = request.data.get('respuestas')
        tiempo_empleado = request.data.get('tiempo_empleado')
        usuario_id = request.data.get('usuario_id')  # Cambiado de alumno_id a usuario_id

        if respuestas is None or tiempo_empleado is None or usuario_id is None:
            return Response({'error': 'Datos incompletos'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar que el usuario existe
        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Inicializar contador de respuestas correctas
        preguntas_correctas = 0

        # Procesar cada respuesta
        for pregunta_id, opcion_id in respuestas.items():
            if opcion_id is None:
                continue
            
            try:
                pregunta = Pregunta.objects.get(id=pregunta_id, examen=examen)
                opcion = Opcion.objects.get(id=opcion_id, pregunta=pregunta)
                if opcion.es_correcta:
                    preguntas_correctas += 1

            except (Pregunta.DoesNotExist, Opcion.DoesNotExist):
                return Response({'error': 'Pregunta o opción no válida'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tiempo_empleado_timedelta = timedelta(seconds=tiempo_empleado)
            resultado = Resultado.objects.create(
                examen=examen,
                usuario=usuario,  # Cambiado de alumno a usuario
                puntuacion=preguntas_correctas,
                tiempo_empleado=tiempo_empleado_timedelta,
                respuestas=respuestas
            )

            return Response({
                'mensaje': 'Resultado guardado correctamente',
                'preguntas_correctas': preguntas_correctas,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class UploadTxtExamenView(APIView):
    def post(self, request):
        print("REQUEST FILES: ", request.FILES)
        print("USER_ID: ", request.data.get('user_id'))
        archivo_txt = request.FILES.get('archivo_txt')
        user_id = request.data.get('user_id')  # Usar user_id

        if not archivo_txt:
            return Response({'error': 'No se adjuntó ningún archivo'}, status=status.HTTP_400_BAD_REQUEST)

        if not user_id:
            return Response({'error': 'ID del usuario es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar que el usuario existe
        creado_por = get_object_or_404(Usuario, id=user_id)

        try:
            contenido = archivo_txt.read().decode('utf-8')
            print("CONTENIDO DEL ARCHIVO: ", contenido)
            examen, preguntas_creadas = self.procesar_contenido_txt(contenido, creado_por)

            return Response({'mensaje': 'Examen y preguntas creados correctamente'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def procesar_contenido_txt(self, contenido, creado_por):
        examen_regex = re.compile(r'Nombre del examen:\s*(.*)\nDescripción:\s*(.*)\n', re.MULTILINE)
        pregunta_regex = re.compile(r'Pregunta:\s*(.*?)\n((?:[a-z]\)\s*.*?\n)+)(?:Explicación:\s*(.*))?\n?', re.MULTILINE)

        examen_match = examen_regex.search(contenido)
        if not examen_match:
            raise ValueError('El archivo no tiene la estructura correcta para el examen.')

        nombre_examen = examen_match.group(1).strip()
        descripcion_examen = examen_match.group(2).strip()

        # Crear el examen con el campo creado_por
        examen = Examen.objects.create(
            nombre=nombre_examen,
            descripcion=descripcion_examen,
            randomizar_preguntas=False,
            randomizar_opciones=False,
            preguntas_por_pagina=5,
            creado_por=creado_por  # Asigna el creador
        )

        preguntas_match = pregunta_regex.findall(contenido)
        if not preguntas_match:
            raise ValueError('No se encontraron preguntas en el archivo.')

        for pregunta_texto, opciones_texto, explicacion in preguntas_match:
            pregunta = Pregunta.objects.create(
                texto=pregunta_texto.strip(),
                examen=examen,
                explicacion=explicacion.strip() if explicacion else ''
            )

            opciones = [opcion.strip() for opcion in opciones_texto.strip().splitlines() if opcion.strip()]
            for opcion_texto in opciones:
                es_correcta = opcion_texto.endswith('*')
                opcion_texto_limpio = opcion_texto.replace('*', '').strip()

                if len(opcion_texto_limpio) > 3 and opcion_texto_limpio[1] == ')':
                    opcion_texto_limpio = opcion_texto_limpio[3:].strip()

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
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print("Datos recibidos para el login:", request.data)

        # Autenticar usuario
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Generar o recuperar el token de autenticación del usuario
            token, created = Token.objects.get_or_create(user=user)
            print("Token generado:", token.key)
            return Response({
                'token': token.key,
                'username': user.username,
                'user_id': user.id,  # Añade el user_id a la respuesta
                'role': 'profesor' if user.es_profesor else 'alumno' if user.es_alumno else 'independiente'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Credenciales inválidas, por favor verifica tu nombre de usuario y contraseña'
            }, status=status.HTTP_401_UNAUTHORIZED)

    
    
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
    
    

class AlumnoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.filter(es_alumno=True)  # Filtrar solo los alumnos
    serializer_class = UsuarioSerializer
        
        
        
class ProfesorViewSet(viewsets.ViewSet):
    """
    ViewSet para gestionar las acciones de los profesores, incluyendo
    la asignación y eliminación de alumnos.
    """

    def list(self, request):
        """Listar todos los profesores"""
        profesores = Usuario.objects.filter(es_profesor=True)
        serializer = UsuarioSerializer(profesores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        """Obtener los detalles de un profesor específico por ID"""
        try:
            profesor = Usuario.objects.get(id=pk, es_profesor=True)
            serializer = UsuarioSerializer(profesor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({"error": "Profesor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get', 'post'], url_path='alumnos')
    def alumnos(self, request, pk=None):
        """Listar alumnos asignados a un profesor específico (GET) y asignar un alumno (POST)"""
        try:
            profesor = Usuario.objects.get(id=pk, es_profesor=True)
            
            if request.method == 'GET':
                # Obtener la lista de alumnos asignados al profesor
                alumnos = profesor.alumnos_asignados.all()
                serializer = UsuarioSerializer(alumnos, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            elif request.method == 'POST':
                # Asignar un nuevo alumno al profesor
                alumno_username = request.data.get('username')
                alumno = Usuario.objects.get(username=alumno_username, es_alumno=True)
                profesor.alumnos_asignados.add(alumno)
                return Response(UsuarioSerializer(alumno).data, status=status.HTTP_201_CREATED)
        
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], url_path='alumnos/(?P<alumno_id>[^/.]+)')
    def remove_alumno(self, request, pk=None, alumno_id=None):
        """Eliminar un alumno asignado a un profesor"""
        try:
            profesor = Usuario.objects.get(id=pk, es_profesor=True)
            alumno = Usuario.objects.get(id=alumno_id, es_alumno=True)
            profesor.alumnos_asignados.remove(alumno)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Usuario.DoesNotExist:
            return Response({"error": "Alumno no encontrado"}, status=status.HTTP_404_NOT_FOUND)