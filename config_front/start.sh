#! /bin/bash

sudo apt update
sudo apt upgrade -y
sudo apt install nodejs npm
sudo npm install -g @angular/cli


cd ~/MyTiendita/frontend/

npm install

ng build --configuration production

sudo mkdir -p /var/www/frontend
sudo cp -r /root/MyTiendita/frontend/dist/frontend/* /var/www/frontend/

sudo apt install nginx

sudo nano /etc/nginx/sites-available/frontend.conf
# y dentro del archivo ponemos lo que esta en el archivo de frontend.conf

sudo ln -s /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/

sudo nginx -t

sudo systemctl reload nginx

sudo ufw allow from 10.8.0.0/24 to any port 80


