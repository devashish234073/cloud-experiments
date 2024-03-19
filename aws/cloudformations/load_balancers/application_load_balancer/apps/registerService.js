const http = require('http');
let PORT = 9998;
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
        } else if (req.url.indexOf("/saveUser?") > -1) {
            let userData = req.url.replace("/saveUser", "");
            callApi(dbUrl + "/insert" + userData).then((data) => {
                res.end(data);
            });
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end("invalid request");
        }
    });
    server.listen(PORT, () => {
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
