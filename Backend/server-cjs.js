const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server is running!' }));
});

server.listen(8080, () => {
    console.log('Server running on port 8080');
});
