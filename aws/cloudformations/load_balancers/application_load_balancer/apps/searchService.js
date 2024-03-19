const http = require('http');
let PORT = 9997;
let dbHost = null;
let dbPort = null;
if (process.argv.length >= 4) {
    dbHost = process.argv[2];
    dbPort = parseInt(process.argv[3]);
    if (process.argv.length == 5) {
        let p = parseInt(process.argv[4]);
        if (p > 1000) {
            PORT = p;
            console.log("PORT updated " + PORT);
        } else {
            console.log("Swtched to default PORT " + PORT);
        }
        listenForCalls();
    } else {
        console.log("Swtched to default PORT " + PORT);
        listenForCalls();
    }
} else {
    console.log("db host and port required");
}

async function listenForCalls() {
    const dbUrl = 'http://' + dbHost + ":" + dbPort;
    let server = http.createServer((req, res) => {
        if(req.url.indexOf("/health")==0) {
            res.end("OK");
        } else if(req.url=="/") {
            callApi(dbUrl+"/selectAll").then((data)=>{
                res.end(data);
            });
        } else {
            let id = req.url.split("/").join("");
            if(id!="" && parseInt(id)>=0) {
                callApi(dbUrl+"/select?id="+parseInt(id)).then((data)=>{
                    res.end(data);
                });
            }
        }
    });
    server.listen(PORT,()=>{
        console.log(`listening on PORT ${PORT}, dbUrl is: ${dbUrl}`);
    });
}

function callApi(apiUrl) {
    return new Promise((resolve) => {
        const req = http.get(apiUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (error) => {
            resolve(error);
        });
    });
}
