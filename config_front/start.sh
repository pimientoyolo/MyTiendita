#! /bin/bash

sudo apt update
sudo apt upgrade -y
sudo apt install nodejs npm
sudo npm install -g @angular/cli
npm install -g npm-check-updates



cd ~/MyTiendita/frontend/

ncu -u # actualiza el package.json

yarn install
npm install
npm audit fix --force
ng update @angular/core@15 @angular/cli@15 --force
ng build --configuration production
