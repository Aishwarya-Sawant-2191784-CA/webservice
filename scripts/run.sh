#!/bin/bash

#start app
cd /home/ec2-user/webservice
sudo pm2 kill
sudo npm i
npm install --save statsd-client
sleep 30
mkdir logs
cd /home/ec2-user/webservice/logs/
touch index.log
cd ..
sudo pm2 start index.js -l "/home/ec2-user/webservice/logs/index.log" -f
sudo pm2 startup systemd
sudo pm2 save
sudo pm2 restart all --update-env
sudo mv cloudwatch-config.json /opt/cloudwatch-config.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s
