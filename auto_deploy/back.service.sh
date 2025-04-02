#!/bin/bash
sudo nano /etc/systemd/system/backend.service

# pegamos el siguiente contenido lo que estan en el backend.service

# reiniciamos los servicios
sudo systemctl daemon-reload

# activamos el servicio
sudo systemctl enable backend.service

# iniciamos el servicio
sudo systemctl start backend.service

# corremos el servicio
sudo systemctl enable backend.service

# chequeamos el estado del servicio
sudo systemctl status backend.service
