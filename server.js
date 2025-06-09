const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Load SSL certificates
const privateKey = fs.readFileSync('certs/key.pem', 'utf8');
const certificate = fs.readFileSync('certs/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const server = https.createServer(credentials, (req, res) => {
  if (req.url === '/harvard.mp3') {
    const audioPath = path.resolve(__dirname, 'harvard.mp3');
    if (fs.existsSync(audioPath)) {
      const stat = fs.statSync(audioPath);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(audioPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Audio file not found');
    }
  } else if (req.url === '/') {
    const htmlPath = path.resolve(__dirname, 'tests/test-page.html');
    if (fs.existsSync(htmlPath)) {
      const stat = fs.statSync(htmlPath);
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
      });
      fs.createReadStream(htmlPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Test page not found');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`HTTPS server started on port ${PORT}`);
}); 