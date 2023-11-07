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

Its the below command here(make sure to replace the name of cluster, region and projectid that you have used):

`
gcloud container clusters get-credentials cluster1 --region us-central1 --project yootooo
`

Running this in cloud shell will show a popup to authorize it, click on the authorize:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/59741e39-24de-4af7-a56a-e9ef3c572519)

Create a new directory named "app"(you can use any other name) and create two files in it:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/6499327c-6adb-4767-91ae-6a02a9e35a02)

Below are the contents of the two files:

## Dockerfile

```
FROM node:14
RUN mkdir node
COPY server.js ./node
WORKDIR ./node/
EXPOSE 8081
CMD ["node","server.js"]
```
Using this file we will build the image containing the below nodejs application

## server.js

```
var http = require("http");
const os = require('os');
let totalVisitor = 0;
var server = http.createServer((req, res) => {
    if (req.url == "/") {
        totalVisitor++;
    }
    res.end("This application is being served from " + getIP() + " and you are " + totalVisitor + "th visitor.");
});
let PORT = 8081;
server.listen(PORT, () => {
    console.log("listening on PORT "+PORT);
});

function getIP() {
    const interfaces = os.networkInterfaces();
    let a = "";
    for (const key in interfaces) {
        for (const info of interfaces[key]) {
            if (info.family === 'IPv4' && !info.internal) {
                a += "[" + key + " " + info.address + "] ";
            }
        }
    }
    return a;
}
```

This nodejs code displays the ip of the pod in which it is running and it also has a counter variable to track the number of times this url is hit.

## Next create a repository in "Artifact Registery" using gcp console(we will have to push the image we will built using the Dockerfile to this repo):

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/56b59b66-243c-4673-b22a-a44a0f2c3d68)

Give the repo an appropriate name and create it:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/30944fc5-4b03-44dd-9f18-b12d4ae7ad24)

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/a0985ad3-b078-450e-b977-9f326a9ac81f)

## Next click on "Setup Instruction" to get the first step to configure docker:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/ddc970f4-ab9a-4fed-a35c-0aa2648861b3)

It will show the below command to run in the cloud shell:

```
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## Run the above code and then build the image by running the below code in the cloud shell(making sure you are in the same directory as the Dockerfile and server.js):

```
docker build -t nodeapp .
```

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/9f7caded-c6bc-4cfb-b755-60eef23aa414)

## Inside the repo there is a copy button copy the full name of the repo by clicking on it:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/0fbebdc2-2a86-4bc8-bee7-e55e74261bd4)

It will copy  this text: "us-central1-docker.pkg.dev/yootooo/myrepo"

## Now tag the image we build above with this copied name:

```
docker tag nodeapp us-central1-docker.pkg.dev/yootooo/myrepo/nodeapp:v0
```

Notice I have added the imagename also with the repo path

## Next push the image to artifact registery by running the below code:

```
docker push us-central1-docker.pkg.dev/yootooo/myrepo/nodeapp:v0
```

Once created you have refresh the repo in console and it will be visible like this:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/567f9ea1-e4ec-410a-958f-8663edf5723a)

## Back to kubernetes commands, since we have already run the following command for our cluster, we can start running kubectl commands.

```
gcloud container clusters get-credentials cluster1 --region us-central1 --project yootooo
```

## We will start with creating a deploymnt using the above image(if you see any connectivity issue, rerun the above command)

```
kubectl create deployment dep1 --image=us-central1-docker.pkg.dev/yootooo/myrepo/nodeapp:v0
```

If its created successfully you should see the text "deployment.apps/dep1 created" in cloud shell

## Next expose this deployment

```
kubectl expose deployment dep1 --port=8080 --target-port=8081 --type=LoadBalancer
```

You can check the status of pod by running "kubectl get pods" and can get the external ip by running "kubectl get services":

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/cadef7ec-600c-4ec0-a4e4-d67eedeea77d)

You can copy the external IP and append the port 8080 to access the application:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/1db7389c-4032-4369-aa4a-6cad905505eb)

Note: Our application is running on port 8081 as you can see in the server.js file abover , but in the "kubectl expose deployment " command we have mapped port 8080 to 8081, hence accessing it at port 8080

After this we will scale the deployment by running:

```
kubectl scale deployment dep1 --replicas=3
```

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/7991944c-fa2d-4022-8dd5-10fb29f64529)

After this you will be able to see different responses when you hit that EXTERNAL_IP:8080 as responses can be coming from any of the three pods:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/ba9c4a17-a5ed-4ae6-b62c-3943f016142c)

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/8c2eaf4e-3241-401a-bd3d-49fc1b74652b)

Next we will update the code and deploy a new image with a different tag "v1" and rollout the update to the kubernetes cluster

This time we will add a time in the response text, the updated server.js file is:

```
var http = require("http");
const os = require('os');
let totalVisitor = 0;
var server = http.createServer((req, res) => {
    if (req.url == "/") {
        totalVisitor++;
    }
    res.end((new Date())+" | This application is being served from " + getIP() + " and you are " + totalVisitor + "th visitor.");
});
let PORT = 8081;
server.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
});

function getIP() {
    const interfaces = os.networkInterfaces();
    let a = "";
    for (const key in interfaces) {
        for (const info of interfaces[key]) {
            if (info.family === 'IPv4' && !info.internal) {
                a += "[" + key + " " + info.address + "] ";
            }
        }
    }
    return a;
}
```

We will repeat the docker build with the same command as we want to keep the name of the image same and only change its tag:
```
docker build -t nodeapp .
```
Then we will tag and push the image to "Artifact Registery" with below command, [Notice this time the tag is v1 instead of v0]:
```
docker tag nodeapp us-central1-docker.pkg.dev/yootooo/myrepo/nodeapp:v1
docker push us-central1-docker.pkg.dev/yootooo/myrepo/nodeapp:v1
```
If we open Artifact Registry now it will show both the versions:
![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/034d5fd6-6776-4198-9802-7c6e9d1720aa)

Our kubernetes cluster is still running the same old v0, we need to point to the new image using the below command:
```
kubectl set image deployment/dep1 nodeapp=us-central1-docker.pkg.dev/yootooo/myrepo/nodeapp:v1
```
We can check the status of rollout using:
```
kubectl rollout status deployment/dep1
```
![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/70593678-ac9d-463d-b0fd-56fe0e795593)
At this point if you run "kubectl get pods", you can see few pods getting created and few being deleted:
![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/ff8eea95-c158-488b-affb-537fe6a113b7)

Once rollout finished we can run "kubectl get services" and get the enternal endpoint, it will be same as before, but now it will show the changes we did in v1 version of the application:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/5e43eaa9-618d-4ec1-afb5-be17ba6e30d2)

# Automations:

For automating the cluster creaton process, run the automaton.sh.
In cloud shell you can clone the repo and running the file by getting to that directory:
```
git clone https://github.com/devashish234073/cloud-experiments
cd  cloud-experiments/gcp/create-kubernetes-cluster-rollout-image-update
chmod a+x automation.sh
./automation.sh yootooo us-central1 cluster1 repo1 img1 v0 dep1 8081
#here arg1 is projectid, arg2 is the region, arg3 is the cluster name
#arg4 the repo name, arg5 the image name and arg6 the image tag
#arg7 is the deployment name and arg8 is the port in which application is running
#note the port arg7 will be actually mapped to port 8080 which is hardcoded in the automation script
```




























