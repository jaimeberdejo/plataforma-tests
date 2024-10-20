#!/bin/bash

# Variables
DB_NAME="base_datos"     # Nombre de la base de datos
DB_USER="jaime"          # Usuario de la base de datos
DB_HOST="localhost"      # Host de la base de datos
DB_SUPERUSER="postgres"  # Superusuario para realizar las acciones en la DB
APP_NAME="app_examenes" # Nombre de la app en Django

echo "========================"
echo "Eliminando base de datos"
echo "========================"

# Eliminar la base de datos existente
psql -U $DB_SUPERUSER -h $DB_HOST -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "========================"
echo "Creando nueva base de datos"
echo "========================"

# Crear una nueva base de datos
psql -U $DB_SUPERUSER -h $DB_HOST -c "CREATE DATABASE $DB_NAME;"

# Otorgar todos los privilegios al usuario
psql -U $DB_SUPERUSER -h $DB_HOST -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Asegurarse de que el usuario tiene permisos para crear bases de datos
psql -U $DB_SUPERUSER -h $DB_HOST -c "ALTER USER $DB_USER CREATEDB;"

echo "========================"
echo "Eliminando migraciones anteriores"
echo "========================"

# Eliminar las migraciones anteriores (excepto __init__.py)
find ./$APP_NAME/migrations/ -type f -name "*.py" ! -name "__init__.py" -delete
find ./$APP_NAME/migrations/ -type f -name "*.pyc" -delete

echo "========================"
echo "Generando nuevas migraciones"
echo "========================"

# Generar nuevas migraciones
python manage.py makemigrations

echo "========================"
echo "Aplicando migraciones"
echo "========================"

# Aplicar las migraciones a la nueva base de datos
python manage.py migrate

echo "========================"
echo "Proceso completado"
echo "========================"
