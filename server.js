const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 10000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === '/') pathname = '/index.html';

    const relativePath = pathname.replace(/^\/+/, '');
    const filePath = path.resolve(ROOT, relativePath);

    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
      res.writeHead(403, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (statErr, stats) => {
      if (statErr || !stats.isFile()) {
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });

      fs.createReadStream(filePath).pipe(res);
    });
  } catch (error) {
    res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`BR-B app is running on http://${HOST}:${PORT}`);
});
