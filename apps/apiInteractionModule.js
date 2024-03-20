let http = require("http");

function saveInteraction(apiInteractoionServiceUrl,sourceServiceName,destinationServiceName,apiPath,error) {
    if(apiInteractoionServiceUrl==null) {
        return;
    }
    callApi(`${apiInteractoionServiceUrl}/log?serviceName=${sourceServiceName}&apiUrl=${apiPath.replace("http://","").replace("https://","").replace("?","__").split("=").join("___")}&destinationServiceName=${destinationServiceName}&error=${error}`).then((data)=>{
        console.log(data=="saved");
    });
}

module.exports = {
    saveInteraction
}

function callApi(apiUrl) {
    return new Promise((resolve) => {
        console.log("logging "+apiUrl);
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