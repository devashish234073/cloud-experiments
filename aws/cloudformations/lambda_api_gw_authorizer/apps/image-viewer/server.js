const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const IMAGE_DIR = path.join(__dirname, 'images');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Helper function to serve static files
function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;

    if (pathname === '/') {
        serveFile(res, path.join(PUBLIC_DIR, 'index.html'), 'text/html');
    } else if (pathname === '/api/images') {
        fs.readdir(IMAGE_DIR, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read directory' }));
            } else {
                const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(imageFiles));
            }
        });
    } else if (pathname.startsWith('/images/')) {
        const imageFilePath = path.join(IMAGE_DIR, pathname.replace('/images/', ''));
        serveFile(res, imageFilePath, 'image/jpeg');
    } else if (pathname.startsWith('/public/')) {
        const publicFilePath = path.join(PUBLIC_DIR, pathname.replace('/public/', ''));
        serveFile(res, publicFilePath, 'text/html');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
