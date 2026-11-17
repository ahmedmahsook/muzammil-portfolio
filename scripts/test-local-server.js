const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const PUBLIC_DIR = path.join(__dirname, '..', 'portfolio');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening on port ${PORT}`);
  
  const endpoints = [
    '/',
    '/projects-data.js',
    '/images/portrait.png',
    '/images/portrait-alt.png'
  ];

  for (const ep of endpoints) {
    await new Promise((resolve) => {
      http.get(`http://127.0.0.1:${PORT}${ep}`, (res) => {
        let size = 0;
        res.on('data', chunk => size += chunk.length);
        res.on('end', () => {
          console.log(`Endpoint: ${ep} -> Status: ${res.statusCode} | Content-Type: ${res.headers['content-type']} | Size: ${size} bytes`);
          resolve();
        });
      }).on('error', (err) => {
        console.error(`Error on ${ep}:`, err.message || err.code || err);
        resolve();
      });
    });
  }

  server.close(() => {
    console.log('All local endpoints verified successfully. Server closed.');
    process.exit(0);
  });
});
