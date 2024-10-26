from rest_framework import serializers
from .models import Examen, Pregunta, Resultado, Opcion, Usuario


        
class OpcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opcion
        fields = ['id', 'texto', 'es_correcta']  

class PreguntaSerializer(serializers.ModelSerializer):
    opciones = OpcionSerializer(many=True) 

    class Meta:
        model = Pregunta
        fields = ['id', 'texto', 'examen', 'opciones','explicacion']

    def create(self, validated_data):
        #Extraer las opciones del validated_data
        opciones_data = validated_data.pop('opciones')
        #Crear la pregunta primero
        pregunta = Pregunta.objects.create(**validated_data)

        #Crear cada opción y asociarla con la pregunta
        for opcion_data in opciones_data:
            Opcion.objects.create(pregunta=pregunta, **opcion_data)

        return pregunta
    
    def update(self, instance, validated_data):
        opciones_data = validated_data.pop('opciones')
        instance.texto = validated_data.get('texto', instance.texto)
        instance.explicacion = validated_data.get('explicacion', instance.explicacion)
        instance.save()

        #Actualizar las opciones de la pregunta
        instance.opciones.all().delete()  #Eliminar las opciones antiguas
        for opcion_data in opciones_data:
            Opcion.objects.create(pregunta=instance, **opcion_data)

        return instance

class ExamenSerializer(serializers.ModelSerializer):
    preguntas = PreguntaSerializer(many=True, read_only=True)  # Serializar preguntas relacionadas

    class Meta:
        model = Examen
        fields = '__all__'
        
    
class ResultadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resultado
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'es_profesor', 'es_alumno']
        
        
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'es_profesor', 'es_alumno', 'password', 'alumnos_asignados']
    
    def create(self, validated_data):
        # Sobrescribir el método `create` para gestionar la creación del usuario con su contraseña
        user = Usuario(
            username=validated_data['username'],
            es_profesor=validated_data.get('es_profesor', False),
            es_alumno=validated_data.get('es_alumno', False),
            password=validated_data['password']
        )
        return user