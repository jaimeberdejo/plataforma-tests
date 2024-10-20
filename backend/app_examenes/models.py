from django.db import models


# Modelo Tema: Si los exámenes se dividen por temas
class Tema(models.Model):
    nombre = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

# Modelo Examen
class Examen(models.Model):
    nombre = models.CharField(max_length=200)  # Nombre del examen
    descripcion = models.TextField(blank=True, null=True)  # Descripción opcional
    dividir_por_temas = models.BooleanField(default=False)  # Si el examen está dividido por temas
    randomizar_preguntas = models.BooleanField(default=False)  # Si se randomizan las preguntas
    randomizar_opciones = models.BooleanField(default=False)  # Si se randomizan las respuestas
    preguntas_por_pagina = models.IntegerField(default=1)  # Preguntas por página: 1, 5, 10, 20, todas

    def __str__(self):
        return self.nombre

# Modelo Pregunta
class Pregunta(models.Model):
    texto = models.TextField()  # Descripción de la pregunta
    tema = models.ForeignKey(Tema, on_delete=models.SET_NULL, null=True, blank=True)
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE, related_name="preguntas")
    orden = models.PositiveIntegerField(default=0)  # Nuevo campo para definir el orden

    def __str__(self):
        return f"Pregunta del examen {self.examen.nombre}"

# Modelo Opción: Respuestas posibles a una pregunta
class Opcion(models.Model):
    texto = models.CharField(max_length=300)  # Texto de la opción de respuesta
    es_correcta = models.BooleanField(default=False)  # Indicar si es la respuesta correcta
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name="opciones")  # Relación con Pregunta

    def __str__(self):
        return f"Opción para la pregunta {self.pregunta.texto[:50]}"

# Modelo Resultado: Almacenar el resultado del examen realizado por el usuario

class Resultado(models.Model):
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE)  # Relación con el examen
    puntuacion = models.FloatField()  # Puntaje obtenido
    tiempo_empleado = models.DurationField()  # Tiempo que tardó en completar el examen
    fecha_realizacion = models.DateTimeField(auto_now_add=True)  # Fecha y hora en que se realizó el examen
    respuestas = models.JSONField()  # Guardar respuestas en formato JSON

    def __str__(self):
        return f"Resultado del examen {self.examen.nombre} - {self.puntaje} puntos"