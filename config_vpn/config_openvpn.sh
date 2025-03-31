#!/bin/bash

# Instalar OpenVPN y EasyRSA
apt update && apt install openvpn easy-rsa -y

# Crear directorio para EasyRSA y copiar archivos
mkdir -p /etc/openvpn/easy-rsa
cp -r /usr/share/easy-rsa/* /etc/openvpn/easy-rsa/
cd /etc/openvpn/easy-rsa

# Inicializar infraestructura de claves
./easyrsa init-pki

# Construir la Autoridad Certificadora (CA)
./easyrsa build-ca nopass

## common name es como quien emite el certificado, usando en este caso "mytiendita-ca"

# Generar clave y certificado para el servidor
./easyrsa gen-req server nopass ## common name "mytiendita-key"
./easyrsa sign-req server server

# Generar parámetros Diffie-Hellman
./easyrsa gen-dh

# Generar clave TLS
openvpn --genkey --secret ta.key

# Copiar archivos a la configuración de OpenVPN
cp pki/ca.crt pki/issued/server.crt pki/private/server.key pki/dh.pem ta.key /etc/openvpn/

# Crear archivo de configuración del servidor OpenVPN
cat <<EOF > /etc/openvpn/server.conf
port 1194
proto udp
dev tun
ca /etc/openvpn/ca.crt
cert /etc/openvpn/server.crt
key /etc/openvpn/server.key
dh /etc/openvpn/dh.pem
tls-auth /etc/openvpn/ta.key 0
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
push "dhcp-option DNS 1.1.1.1"
push "dhcp-option DNS 8.8.8.8"
keepalive 10 120
cipher AES-256-CBC
persist-key
persist-tun
status openvpn-status.log
verb 3
EOF

# Habilitar el reenvío de paquetes IP
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
sysctl -p

# Configurar reglas de firewall para OpenVPN
ufw allow 1194/udp # permitir el trafico por este puerto
ufw disable # deshabilitar el firewall para aplicar cambios
ufw enable # habilitar el firewall nuevamente para que aplique los cambios

# Iniciar y habilitar OpenVPN
systemctl start openvpn@server
systemctl enable openvpn@server
systemctl status openvpn@server

