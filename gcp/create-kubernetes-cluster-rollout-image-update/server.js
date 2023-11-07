var http = require("http");
const os = require('os');
let totalVisitor = 0;
var server = http.createServer((req, res) => {
    if (req.url == "/") {
        totalVisitor++;
    }
    res.end((new Date())+" | This application is being served from " + getIP() + " and you are " + totalVisitor + "th visitor.");
});
let PORT = 8081;
server.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
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