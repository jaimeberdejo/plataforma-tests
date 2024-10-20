from rest_framework import serializers
from .models import Examen, Pregunta, Resultado, Tema, Opcion

        
class OpcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opcion
        fields = ['id', 'texto', 'es_correcta']  # Excluir 'pregunta' porque se asociará automáticamente

class PreguntaSerializer(serializers.ModelSerializer):
    opciones = OpcionSerializer(many=True)  # Permitimos la creación de varias opciones anidadas

    class Meta:
        model = Pregunta
        fields = ['id', 'texto', 'tema', 'examen', 'opciones']

    def create(self, validated_data):
        # Extraer las opciones del validated_data
        opciones_data = validated_data.pop('opciones')
        # Crear la pregunta primero
        pregunta = Pregunta.objects.create(**validated_data)

        # Crear cada opción y asociarla con la pregunta
        for opcion_data in opciones_data:
            Opcion.objects.create(pregunta=pregunta, **opcion_data)

        return pregunta
    
    def update(self, instance, validated_data):
        opciones_data = validated_data.pop('opciones')
        instance.texto = validated_data.get('texto', instance.texto)
        instance.save()

        # Actualizar las opciones de la pregunta
        instance.opciones.all().delete()  # Eliminar las opciones antiguas
        for opcion_data in opciones_data:
            Opcion.objects.create(pregunta=instance, **opcion_data)

        return instance

class ExamenSerializer(serializers.ModelSerializer):
    preguntas = PreguntaSerializer(many=True, read_only=True)  # Serializar preguntas relacionadas

    class Meta:
        model = Examen
        fields = '__all__'


class TemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tema
        fields = '__all__'
        
    
class ResultadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resultado
        fields = '__all__'

