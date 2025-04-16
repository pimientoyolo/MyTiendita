#!/bin/bash

# Directorio del proyecto backend
PROJECT_DIR="/root/MyTiendita"  # Ruta de tu proyecto
BACKEND_DIR="/root/MyTiendita/backend"  # Ruta de tu proyecto
FRONTEND_DIR="/root/MyTiendita/frontend"
DEPLOY_FRONTEND_DIR="/var/www/frontend"

RESTART_COMMAND_BACK="sudo systemctl restart backend"  # Comando para iniciar el backend
RESTART_COMMAND_FRONT="sudo systemctl reload nginx"  # Comando para iniciar el frontend

# Comando para compilar el backend con Maven
BUILD_COMMAND_BACK="mvn clean install -DskipTests"  # Comando Maven para compilar el proyecto
BUILD_COMMAND_FRONT="ng build --configuration production"  # Comando para compilar el frontend

# Función para compilar el proyecto
build_backend() {
  echo "Compilando el backend..."
  cd $BACKEND_DIR
  $BUILD_COMMAND_BACK
}

build_frontend() {
  echo "Actualizando dependencias del frontend..."
  cd $FRONTEND_DIR
  npm install
  
  echo "Compilando el frontend..."
  $BUILD_COMMAND_FRONT
  sudo mkdir -p $DEPLOY_FRONTEND_DIR
  rsync -av --delete "$FRONTEND_DIR/dist/frontend/" "$DEPLOY_FRONTEND_DIR/"
}

# Función para comprobar si hay diferencias con la rama principal
check_git_changes() {
  cd $PROJECT_DIR
  git fetch -q origin main
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
    #realizar el backend
    build_backend
    $RESTART_COMMAND_BACK  # Reiniciar el backend
    echo "Backend reiniciado."

    # Reiniciar el frontend
    build_frontend
    $RESTART_COMMAND_FRONT  # Reiniciar el frontend
    echo "Frontend reiniciado."
  fi

  # Esperar 1 minuto antes de volver a comprobar
  sleep 60
done
