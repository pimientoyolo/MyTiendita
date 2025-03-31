#! /bin/bash

# Actualizar repositorios e instalar UFW
apt update && apt install ufw -y

# Permitir conexiones SSH (evita bloquearte)
ufw allow OpenSSH

# Habilitar el firewall
ufw enable

# Verificar el estado y reglas activas
ufw status verbose
