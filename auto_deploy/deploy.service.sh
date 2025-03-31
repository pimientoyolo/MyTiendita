#! /bin/bash

# creamos el archivo y pegamos lo del deploy.sh
nano /root/deploy.sh

# le damos permisos de ejecucion
sudo chmod +x /root/deploy.sh

# creamos el archivo de servicio
sudo nano /etc/systemd/system/deploy.service

# pegamos lo del deploy.service


#iniciamos el servicio
sudo systemctl daemon-reload
sudo systemctl enable deploy.service
sudo systemctl start deploy.service
sudo systemctl status deploy.service


