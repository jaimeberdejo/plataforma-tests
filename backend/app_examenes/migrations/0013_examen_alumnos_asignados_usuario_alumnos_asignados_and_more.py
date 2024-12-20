# Generated by Django 5.1.2 on 2024-10-25 20:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app_examenes", "0012_examen_creado_por"),
    ]

    operations = [
        migrations.AddField(
            model_name="examen",
            name="alumnos_asignados",
            field=models.ManyToManyField(
                blank=True,
                help_text="Alumnos que tienen acceso a este examen",
                limit_choices_to={"es_alumno": True},
                related_name="examenes_asignados",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="usuario",
            name="alumnos_asignados",
            field=models.ManyToManyField(
                blank=True,
                help_text="Alumnos asignados a un profesor",
                limit_choices_to={"es_alumno": True},
                related_name="profesor",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="examen",
            name="creado_por",
            field=models.ForeignKey(
                limit_choices_to={"es_profesor": True},
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
