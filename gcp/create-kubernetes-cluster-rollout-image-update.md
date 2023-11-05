## Search for Kubernetes engine in GCP console and click create
![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/2ee7a033-9430-4e39-a36d-20e1801c3794)

## Keep everything default and click on create cluster

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/e9f7d590-e42f-4231-88b3-565132506cc3)

Once cluster is created it can be seen as below:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/d85ae0ed-66f7-487e-b353-b4016ab062e5)

Scrollig to the right end clicking on the three dots there will be a "Connect" button:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/5ff44ce7-60bc-410b-8b0e-50e87819a1cf)

Clicking on it will show steps to get credentials for connecting to the cluster:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/e785fbe5-4fbd-4fce-822b-ce99b7c793e9)

Its the below command here:

`
gcloud container clusters get-credentials cluster1 --region us-central1 --project yootooo
`






