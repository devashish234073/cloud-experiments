let apiInteractionModule = require("./apiInteractionModule");
let apiInteractionUrl=null;
const http = require('http');
const fs = require("fs");
let PORT = 9996;
let registerServiceUrl = null;
let searchServiceUrl = null;
for(let i=0;i<process.argv.length;i++) {
    let arg = process.argv[i];
    if(arg.indexOf("PORT=")==0) {
        PORT = parseInt(arg.replace("PORT=",""));
    } else if(arg.indexOf("dbUrl=")==0) {
        dbUrl = parseInt(arg.replace("dbUrl=",""));
    } else if(arg.indexOf("registerServiceUrl=")==0) {
        registerServiceUrl = arg.replace("registerServiceUrl=","");
    } else if(arg.indexOf("searchServiceUrl=")==0) {
        searchServiceUrl = arg.replace("searchServiceUrl=","");
    } else if(arg.indexOf("interactionServer=")==0) {
        apiInteractionUrl=arg.replace("interactionServer=","");
        console.log("API interaction enabled, will send requests to "+apiInteractionUrl);
    }
}
console.log(`Using PORT ${PORT}`);

if (registerServiceUrl!=null && searchServiceUrl!=null) {
    listenForCalls();
} else {
    console.log("registerService's and searchService's host and port required");
}

function listenForCalls() {
    let server = http.createServer((req, res) => {
        if (req.url.indexOf("/health") == 0) {
            res.end("OK");
        } else if (req.url == "/") {
            fs.readFile("ui/home.html", (err, data) => {
                if (err) {
                    res.end("Error occured");
                } else {
                    let html = String(data);
                    res.end(html);
                }
            });
        } else if (req.url.indexOf("/search?id=") == 0) {
            let id = req.url.replace("/search?id=", "");
            fs.readFile("ui/searchedUser.html", (err, data) => {
                if (err) {
                    res.end("Error occured");
                } else {
                    callApi(searchServiceUrl + "/" + id).then((user) => {
                        try {
                            let userObj = JSON.parse(user);
                            let html = String(data).split("__NAME__").join(userObj.name).split("__ID__").join(userObj.id);
                            res.end(html);
                        } catch (e) {
                            console.error(e);
                            let html = String(data).split("__NAME__").join("Not Found").split("__ID__").join("Not Found");
                            res.end(html);
                        }
                    });
                }
            });
        } else if (req.url.indexOf("/registerUserHome") == 0) {
            fs.readFile("ui/register.html", (err, data) => {
                if (err) {
                    res.end("Error occured");
                } else {
                    let html = String(data);
                    res.end(html);
                }
            });
        } else if (req.url.indexOf("/registerUser?") == 0) {
            let query = req.url.replace("/registerUser?","");
            callApi(registerServiceUrl + "/saveUser?"+query).then((user) => {
                fs.readFile("ui/home.html", (err, data) => {
                    if (err) {
                        res.end("Error occured");
                    } else {
                        let html = String(data);
                        res.end(html);
                    }
                });
            });
        } else if (req.url.indexOf("/showAllUsers") == 0) {
            fs.readFile("ui/allUsers.html", (err, data) => {
                if (err) {
                    res.end("Error occured");
                } else {
                    callApi(searchServiceUrl).then((allUsers) => {
                        let rows = "";
                        try {
                            allUsers = JSON.parse(allUsers);
                            for (k in allUsers) {
                                let user = allUsers[k];
                                rows += `<tr><td>${user.id}</td><td>${user.name}</td></tr>`;
                            }
                        } catch (e) {
                            rows = allUsers;
                            console.error(e);
                        }
                        let html = String(data).split("__DATA__").join(rows);
                        res.end(html);
                    });
                }
            });
        }
    });
    server.listen(PORT, () => {
        console.log(`listening on PORT ${PORT} processid ${process.pid}, registerServiceUrl is: ${registerServiceUrl} and searchServiceUrl is ${searchServiceUrl}`);
    });
}

function callApi(apiUrl) {
    return new Promise((resolve) => {
        let dest = apiUrl.indexOf("saveUser?")>-1?"RegisterService":"SearchService";
        const req = http.get(apiUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                apiInteractionModule.saveInteraction(apiInteractionUrl,"UI",dest,apiUrl,"ok");
                resolve(data);
            });
        });
        req.on('error', (error) => {
            apiInteractionModule.saveInteraction(apiInteractionUrl,"UI",dest,apiUrl,error);
            resolve(error);
        });
    });
}