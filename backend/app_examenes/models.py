from django.db import models


#Modelo Tema: Si los exámenes se dividen por temas
class Tema(models.Model):
    nombre = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

#Modelo Examen
class Examen(models.Model):
    nombre = models.CharField(max_length=200)  # Nombre del examen
    descripcion = models.TextField(blank=True, null=True)  # Descripción opcional
    dividir_por_temas = models.BooleanField(default=False)  # Si el examen está dividido por temas
    randomizar_preguntas = models.BooleanField(default=False)  # Si se randomizan las preguntas
    randomizar_opciones = models.BooleanField(default=False)  # Si se randomizan las respuestas
    preguntas_por_pagina = models.IntegerField(default=1)  # Preguntas por página

    def __str__(self):
        return self.nombre

#Modelo Pregunta
class Pregunta(models.Model):
    texto = models.TextField()  
    tema = models.ForeignKey(Tema, on_delete=models.SET_NULL, null=True, blank=True)
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE, related_name="preguntas")
    explicacion = models.TextField(blank=True, null=True)  

    def __str__(self):
        return f"Pregunta del examen {self.examen.nombre}"

#Modelo Opción: Respuestas posibles a una pregunta
class Opcion(models.Model):
    texto = models.CharField(max_length=300)  
    es_correcta = models.BooleanField(default=False)  
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name="opciones")  

    def __str__(self):
        return f"Opción para la pregunta {self.pregunta.texto[:50]}"

#Modelo Resultado: Almacenar el resultado del examen realizado por el usuario

class Resultado(models.Model):
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE)  
    puntuacion = models.FloatField() 
    tiempo_empleado = models.DurationField()  
    fecha_realizacion = models.DateTimeField(auto_now_add=True)  
    respuestas = models.JSONField()  

    def __str__(self):
        return f"Resultado del examen {self.examen.nombre} - {self.puntaje} puntos"