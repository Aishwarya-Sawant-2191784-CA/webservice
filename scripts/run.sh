#!/bin/bash

#start cloudwatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
-a fetch-config \
-m ec2 \
-c file:/home/ec2-user/webservice/statsd/config.json \
-s

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