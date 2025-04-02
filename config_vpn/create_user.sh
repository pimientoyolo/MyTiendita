#!/bin/bash

# Crear un nuevo usuario para OpenVPN
cd /etc/openvpn/easy-rsa/
./easyrsa build-client-full miusuario nopass # el usuario es "miusuario"

# Crear el directorio para el cliente y copiar los certificados
mkdir -p /etc/openvpn/clients/miusuario
cp pki/ca.crt pki/issued/miusuario.crt pki/private/miusuario.key ta.key /etc/openvpn/clients/miusuario/

# crear el archivo de configuración del cliente
cat <<EOF > /etc/openvpn/clients/miusuario/miusuario.ovpn
client
dev tun
proto udp
remote 192.81.213.157 1194
resolv-retry infinite
nobind
route-nopull
route 10.8.0.0 255.255.255.0
persist-key
persist-tun
remote-cert-tls server
ca ca.crt
cert miusuario.crt
key miusuario.key
tls-auth ta.key 1
cipher AES-256-CBC
verb 3
EOF

# Instalar zip para comprimir los certificados y la configuración
sudo apt update && sudo apt install zip -y


#crear el zip de los certificados y la configuracion
zip -rj /etc/openvpn/clients/miusuario/miusuario.zip /etc/openvpn/clients/miusuario/*

## la ip 192.81.213.157 es la ip publica del servidor
## tener en encuentas el nombre de "miusuario" para el cliente