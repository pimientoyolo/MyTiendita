#! /bin/bash

sudo apt update

# Install Java 17
sudo apt install openjdk-17-jdk
java -version

# instalar maven
sudo apt install maven
mvn -v

# isntalar git
sudo apt install git
git --version

# bajarse el proyecto
git clone https://{GIT_TOKEN}@github.com/pimientoyolo125/MyTiendita.git
## cambiar el token por el tuyo

#entramos la proyecto 
cd MyTiendita
cd backend

# compilamos el proyecto
mvn clean install

# configuramos el firewall
ufw allow from 10.8.0.0/24 to any port 8080

# corremos el proyecto
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod