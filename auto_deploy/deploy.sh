#!/bin/bash

# Directorio del proyecto backend
PROJECT_DIR="/root/MyTiendita/backend"  # Ruta de tu proyecto

# Comando para detener el backend si está en ejecución
STOP_COMMAND="systemctl stop backend.service"  # Detener el servicio backend

# Comando para iniciar el backend
START_COMMAND="systemctl start backend.service"  # Iniciar el servicio backend

# Comando para compilar el backend con Maven
BUILD_COMMAND="mvn clean install -DskipTests"  # Comando Maven para compilar el proyecto

# Función para detener el proyecto si está corriendo
stop_project() {
  echo "Deteniendo el proyecto..."
  $STOP_COMMAND
}

# Función para arrancar el proyecto
start_project() {
  echo "Iniciando el proyecto..."
  $START_COMMAND
}

# Función para compilar el proyecto
build_project() {
  echo "Compilando el proyecto..."
  cd $PROJECT_DIR
  $BUILD_COMMAND
}

# Función para comprobar si hay diferencias con la rama principal
check_git_changes() {
  cd $PROJECT_DIR
  CHANGES=$(git diff --name-only origin/main)

  if [ -z "$CHANGES" ]; then
    echo "No hay cambios en el repositorio."
    return 1  # No hay cambios
  else
    echo "Se encontraron cambios en el repositorio."
    git pull origin main
    return 0  # Hay cambios
  fi
}

# Loop que ejecuta el script de forma continua
while true; do
  echo "Verificando cambios en el repositorio..."
  
  # Comprobar si hay cambios en el repositorio
  if check_git_changes; then
    # Detener el backend
    stop_project
    
    # Compilar el proyecto
    build_project
    
    # Iniciar el backend
    start_project
  fi

  # Esperar 1 minuto antes de volver a comprobar
  sleep 60
done
