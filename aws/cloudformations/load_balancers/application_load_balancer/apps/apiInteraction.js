let http = require("http");
let PORT = 9995;
for(let i=0;i<process.argv.length;i++) {
    let arg = process.argv[i];
    if(arg.indexOf("PORT=")==0) {
        PORT = parseInt(arg.replace("PORT=",""));
    }
}
console.log(`Using PORT ${PORT}`);

let logs = {};

let server = http.createServer((req,res)=>{
    if(req.url=="/health") {
        res.end("OK");
    } else if(req.url=="/" || req.url=="/showAll") {
        res.end(JSON.stringify(logs));
    } else if(req.url.indexOf("/log?")==0) {
        let query = req.url.replace("/log?","");
        let map = {};
        if(query.indexOf("&")>-1) {
            let querySplit = query.split("&");
            for(let indx in querySplit) {
                let query = querySplit[indx];
                if(query.indexOf("=")>-1) {
                    let params = query.split("=");
                    if(params.length==2) {
                        map[params[0]] = params[1];
                    }
                }
            }
        }
        if(map["serviceName"] && map["apiUrl"] && map["destinationServiceName"]) {
            let key = map["serviceName"]+"__"+map["destinationServiceName"];
            if(logs[key]) {
                logs[key].push({"url":map["apiUrl"],"error":map["error"]});
            } else {
                logs[key] = [{"url":map["apiUrl"],"error":map["error"]}];
            }
            res.end("saved");
        } else {
            console.log("err0");
            res.end("");
        }
    } else {
        console.log("err1 "+req.url);
        res.end("");
    }
});

server.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT} processid ${process.pid}`);
});