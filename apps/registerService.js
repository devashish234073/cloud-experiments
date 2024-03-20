let apiInteractionModule = require("./apiInteractionModule");
let apiInteractionUrl=null;
const http = require('http');
let PORT = 9998;
let dbUrl = null;
for(let i=0;i<process.argv.length;i++) {
    let arg = process.argv[i];
    if(arg.indexOf("PORT=")==0) {
        PORT = parseInt(arg.replace("PORT=",""));
    } else if(arg.indexOf("dbUrl=")==0) {
        dbUrl = arg.replace("dbUrl=","");
    } else if(arg.indexOf("interactionServer=")==0) {
        apiInteractionUrl=arg.replace("interactionServer=","");
        console.log("API interaction enabled, will send requests to "+apiInteractionUrl);
    }
}
console.log(`Using PORT ${PORT}`);

if (dbUrl!=null) {
    listenForCalls();
} else {
    console.log("db host and port required");
}

async function listenForCalls() {
    let server = http.createServer((req, res) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
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
        console.log(`listening on PORT ${PORT} processid ${process.pid}, dbUrl is: ${dbUrl}`);
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
                apiInteractionModule.saveInteraction(apiInteractionUrl,"RegisterService","Db",apiUrl,"ok");
                resolve(data);
            });
        });
        req.on('error', (error) => {
            apiInteractionModule.saveInteraction(apiInteractionUrl,"RegisterService","Db",apiUrl,error);
            resolve(error);
        });
    });
}
