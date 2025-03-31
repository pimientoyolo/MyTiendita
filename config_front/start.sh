#! /bin/bash

# Actualizar paquetes del sistema
sudo apt update

# Instalar Node.js y npm
sudo apt install -y nodejs npm
node -v
npm -v

# Instalar Angular CLI globalmente (si aún no lo tienes instalado)
sudo npm install -g @angular/cli

# Instalar Git - esto ya se hizo en el backend, pero lo dejo por si acaso
#sudo apt install -y git 
#git --version

# Clonar el repositorio (reemplaza {GIT_TOKEN} por tu token)
#git clone https://{GIT_TOKEN}@github.com/pimientoyolo125/MyTiendita.git 

# Entrar al directorio del proyecto y luego al frontend (ajusta el nombre de la carpeta si es distinto)
cd MyTiendita/frontend

# Instalar las dependencias del proyecto
npm install

# Construir el proyecto en modo producción
ng build --prod
# Nota: Dependiendo de la versión o configuración, podrías usar "npm run build" en su lugar

# Instalar Nginx para servir los archivos estáticos
sudo apt install -y nginx

# Configurar UFW para permitir tráfico HTTP (puerto 80) únicamente desde la red VPN
sudo ufw allow from 10.8.0.0/24 to any port 80

# Desplegar los archivos generados al directorio raíz de Nginx
# Se asume que la carpeta de salida del build es "dist/frontend". Ajusta si es necesario.
sudo rm -rf /var/www/html/*
sudo cp -r dist/frontend/* /var/www/html/

# Opcional: Ajustar permisos para que Nginx pueda leer los archivos
sudo chown -R www-data:www-data /var/www/html

# Reiniciar Nginx para aplicar los cambios
sudo systemctl restart nginx

