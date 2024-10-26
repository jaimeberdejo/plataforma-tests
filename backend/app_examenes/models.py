from django.db import models
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    es_profesor = models.BooleanField(default=False, help_text="Indica si el usuario es profesor.")
    es_alumno = models.BooleanField(default=False, help_text="Indica si el usuario es alumno.")
    
    # Relación Many-to-Many entre profesores y sus alumnos
    alumnos_asignados = models.ManyToManyField(
        'self',
        symmetrical=False,  # Permite una relación unidireccional
        related_name='profesor',  # Relación inversa: un alumno puede tener un profesor
        blank=True,
        limit_choices_to={'es_alumno': True},  # Restringe para que solo se puedan asignar usuarios con `es_alumno=True`
        help_text="Alumnos asignados a un profesor"
    )

    # Evitar conflicto con los campos de Django para grupos y permisos
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_usuario_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_usuario_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )
    
    def __str__(self):
        return self.username


class Examen(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    randomizar_preguntas = models.BooleanField(default=False)
    randomizar_opciones = models.BooleanField(default=False)
    preguntas_por_pagina = models.IntegerField(default=1)
    numero_preguntas = models.IntegerField(default=10)
    creado_por = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Solo profesores pueden crear exámenes

    # Alumnos asignados al examen
    alumnos_asignados = models.ManyToManyField(
        Usuario,
        related_name='examenes_asignados',
        limit_choices_to={'es_alumno': True},
        blank=True,
        help_text="Alumnos que tienen acceso a este examen"
    )

    def __str__(self):
        return self.nombre


class Pregunta(models.Model):
    texto = models.TextField()
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE, related_name="preguntas")
    explicacion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Pregunta del examen {self.examen.nombre}"


class Opcion(models.Model):
    texto = models.CharField(max_length=300)
    es_correcta = models.BooleanField(default=False)
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name="opciones")

    def __str__(self):
        return f"Opción para la pregunta {self.pregunta.texto[:50]}"


class Resultado(models.Model):
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE, related_name='resultados')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='resultados')
    puntuacion = models.FloatField()
    tiempo_empleado = models.DurationField()
    fecha_realizacion = models.DateTimeField(auto_now_add=True)
    respuestas = models.JSONField()

    def __str__(self):
        return f"Resultado de {self.alumno.username} - {self.examen.nombre}"
