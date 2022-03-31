#!/bin/bash

sleep 30

sudo yum update -y
sleep 10
sudo yum install ruby wget unzip -y
sleep 10
sudo yum install git make gcc -y
sleep 10
sudo amazon-linux-extras install epel
sleep 10
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash ~/.nvm/nvm.sh
sleep 10
sudo yum install -y gcc-c++ make
sleep 10
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs
sleep 10
sudo npm install -g pm2
sleep 10

# install codedeploy agent
cd /home/ec2-user
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent status
sudo service codedeploy-agent start
sudo service codedeploy-agent status

ls
cd /tmp/
echo "$(pwd)"
ls
cp webservice.zip /home/ec2-user/
cd /home/ec2-user/
unzip -q webservice.zip
ls -ltr
chown ec2-user:ec2-user /home/ec2-user/webservice
cd webservice
sudo npm install
mkdir logs
cd /home/ec2-user/webservice/logs/
touch index.log
cd ..
sudo pm2 start index.js -l "/home/ec2-user/webservice/logs/index.log" -f
sudo pm2 startup systemd
sudo pm2 save
