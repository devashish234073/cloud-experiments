const http = require('http');
const fs = require("fs");
let PORT = 9996;
let registerApiHost = null;
let registerApiPort = null;
let searchApiHost = null;
let searchApiPort = null;
if (process.argv.length >= 6) {
    registerApiHost = process.argv[2];
    registerApiPort = parseInt(process.argv[3]);
    searchApiHost = process.argv[4];
    searchApiPort = parseInt(process.argv[5]);
    if (process.argv.length == 7) {
        let p = parseInt(process.argv[6]);
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
    console.log("registerService's and searchService's host and port required");
}

function listenForCalls() {
    const registerApiUrl = 'http://' + registerApiHost + ":" + registerApiPort;
    const searchApiUrl = 'http://' + searchApiHost + ":" + searchApiPort;
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
                    callApi(searchApiUrl + "/" + id).then((user) => {
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
            callApi(registerApiUrl + "/saveUser?"+query).then((user) => {
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
                    callApi(searchApiUrl).then((allUsers) => {
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
        console.log(`listening on PORT ${PORT}, registerApiUrl is: ${registerApiUrl} and searchApiUrl is ${searchApiUrl}`);
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