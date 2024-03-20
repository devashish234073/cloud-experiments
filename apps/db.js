let http = require("http");
let PORT = 9999;
for(let i=0;i<process.argv.length;i++) {
    let arg = process.argv[i];
    if(arg.indexOf("PORT=")==0) {
        PORT = parseInt(arg.replace("PORT=",""));
    }
}
console.log(`Using PORT ${PORT}`);
let data = {"1":{"id":1,"name":"Devashish Priyadarshi"},"2":{"id":2,"name":"Hritik Roushan"}};
let server = http.createServer((req,res)=>{
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if(req.url.indexOf("/health")==0) {
        res.end("OK");
    } else if(req.url.indexOf("/insert?")==0) {
        let queryStr = req.url.replace("/insert?","").split("&");
        let map = {};
        for(let indx in queryStr) {
            if(queryStr[indx].indexOf("=")>-1) {
                let query = queryStr[indx].split("=");
                if(query.length==2) {
                    map[query[0]] = query[1].split("%20").join(" ");
                }
            }
        }
        if(map["id"] && map["name"]) {
            let action = data[map["id"]]?"updated":"inserted";
            data[map["id"]] = map;
            let meta = {};
            meta[action] = map;
            res.end(JSON.stringify(meta));
        } else {
            res.writeHead(500,{'Content-Type':'application/json'});
            res.end("id and name attributes are required to insert");
        }
    } else if(req.url.indexOf("/select?")==0) {
        let queryStr = req.url.replace("/select?","").split("=");
        if(queryStr.length==2 && queryStr[0]=="id") {
            let id = queryStr[1];
            res.end(JSON.stringify(data[id]));
        }
    } else if(req.url.indexOf("/selectAll")==0) {
        res.end(JSON.stringify(data));
    } else {
        res.writeHead(500,{'Content-Type':'application/json'});
        res.end("error");    
    }
    
});

server.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT} processid ${process.pid}`);
});