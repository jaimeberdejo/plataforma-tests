# Generated by Django 5.1.1 on 2024-10-19 20:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app_examenes', '0004_rename_puntaje_resultado_puntuacion'),
    ]

    operations = [
        migrations.RenameField(
            model_name='examen',
            old_name='randomizar_respuestas',
            new_name='randomizar_opciones',
        ),
    ]
