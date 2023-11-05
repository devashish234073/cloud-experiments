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

`
FROM node:14
RUN mkdir node
COPY server.js ./node
WORKDIR ./node/
EXPOSE 8081
CMD ["node","server.js"]
`

## server.js

`
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
`





