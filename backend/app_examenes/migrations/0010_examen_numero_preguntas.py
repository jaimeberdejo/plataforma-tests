# Generated by Django 5.1.1 on 2024-10-22 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_examenes', '0009_remove_pregunta_tema_remove_examen_dividir_por_temas_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='examen',
            name='numero_preguntas',
            field=models.IntegerField(default=10),
        ),
    ]