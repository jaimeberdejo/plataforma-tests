# Generated by Django 5.1.1 on 2024-10-17 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_examenes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pregunta',
            name='orden',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
