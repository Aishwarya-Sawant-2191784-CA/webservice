#!/bin/bash

#start app
cd /home/ec2-user/webservice
sudo rm -rf webapp.service
pm2 kill
sudo npm i
sleep 30
sudo pm2 start index.js
sudo pm2 save
sudo pm2 startup systemd
sudo pm2 restart all --update-env