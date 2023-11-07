#!/bin/bash
gcloud auth login
gcloud container --project "yootooo" clusters create-auto "$3" --region "$2" --release-channel "regular" --network "projects/$1/global/networks/default" --subnetwork "projects/$1/regions/$2/subnetworks/default" --cluster-ipv4-cidr "/17"

