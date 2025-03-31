#! /bin/bash

# script para instalar y configurar postgresql
apt update && apt install -y postgresql postgresql-contrib

# cambiar por donde escucha el postgresql no sea local si la vpn
nano /etc/postgresql/$(ls /etc/postgresql)/main/postgresql.conf

#buscar la linea "listen_addresses" y cambiarla por "listen_addresses = '10.8.0.1'"

nano /etc/postgresql/$(ls /etc/postgresql)/main/pg_hba.conf

# agregar la linea: host    all             all             10.8.0.0/24          md5

#ingresar para crear la base de datos
sudo -u postgres psql

# crear la base de datos
CREATE DATABASE mytiendita;
CREATE USER mytiendita_admin WITH ENCRYPTED PASSWORD 'password_mytiendita';
GRANT ALL PRIVILEGES ON DATABASE mytiendita TO mytiendita_admin;

ALTER DATABASE mytiendita OWNER TO mytiendita_admin;

\q


# reiniciar el servicio
systemctl restart postgresql

# habilitar trafico por el puerto 5432
ufw allow from 10.8.0.0/24 to any port 5432


# ahora podemos conectarnos a la base de datos con dbeaber con la vpn encendida
# # Host: 10.8.0.1

# # Puerto: 5432

# # Usuario: mytiendita_admin

# # Contraseña: password_mytiendita

# # Base de datos: mytiendita