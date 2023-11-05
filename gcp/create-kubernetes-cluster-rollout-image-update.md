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

## Next Build the image by running the below code in the cloud shell(making sure you are in the same directory as the Dockerfile and server.js):

```
docker build -t nodeapp .
```

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/9f7caded-c6bc-4cfb-b755-60eef23aa414)









