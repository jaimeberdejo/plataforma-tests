from rest_framework.decorators import api_view, action 
from rest_framework.response import Response
from rest_framework import status
from .models import Examen, Pregunta, Opcion, Resultado
from .serializers import ExamenSerializer, PreguntaSerializer, OpcionSerializer, ResultadoSerializer
from rest_framework import viewsets  # Importa viewsets
from rest_framework.views import APIView
import re;
from datetime import timedelta



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
        



