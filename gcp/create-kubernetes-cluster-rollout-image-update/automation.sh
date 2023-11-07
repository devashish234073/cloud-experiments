#!/bin/bash
gcloud auth login
gcloud config set project $1
gcloud container --project "$1" clusters create-auto "$3" --region "$2" --release-channel "regular" --network "projects/$1/global/networks/default" --subnetwork "projects/$1/regions/$2/subnetworks/default" --cluster-ipv4-cidr "/17"
gcloud container clusters get-credentials $3 --region $2 --project $1
gcloud artifacts repositories create $4 --location=$2 --repository-format=docker
gcloud auth configure-docker $2-docker.pkg.dev
docker build -t $5 .
docker tag nodeapp $2-docker.pkg.dev/$1/$4/$5:$6
docker push $2-docker.pkg.dev/$1/$4/$5:$6
kubectl create deployment $7 --image=$2-docker.pkg.dev/$1/$4/$5:$6
kubectl expose deployment $7 --port=8080 --target-port=$8 --type=LoadBalancer
