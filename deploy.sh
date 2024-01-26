#!/bin/bash

# Build and push Docker image to DockerHub
docker build -t tc-producao .
docker tag tc-producao gabrielaontour/tc-producao:v1.0
docker push gabrielaontour/tc-producao:v1.0

# Deploy infrastructure using Terraform
cd infra
terraform init
terraform apply -auto-approve -var "aws_access_key=${AWS_ACCESS_KEY}" -var "aws_secret_key=${AWS_SECRET_KEY}"
cd ..

echo "Deployment completed!"
