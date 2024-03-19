let http = require("http");
let PORT = 9999;
if(process.argv.length==3) {
    let p = parseInt(process.argv[2]);
    if(p>1000) {
        PORT = p;
        console.log("PORT updated "+PORT);
    } else {
        console.log("Swtched to default PORT "+PORT);
    }
} else {
    console.log("Swtched to default PORT "+PORT);
}
let data = {"1":{"id":1,"name":"Devashish Priyadarshi"},"2":{"id":2,"name":"Hritik Roushan"}};
let server = http.createServer((req,res)=>{
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
    console.log(`listening on PORT ${PORT}`);
});