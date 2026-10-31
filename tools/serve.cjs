// 无需安装依赖。固定 localhost 端口，以便浏览器继续读取同一份存档。
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.ttf':'font/ttf', '.otf':'font/otf', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  let target;
  try { target = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400); res.end(); return; }
  if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  if (target === root) target = path.join(root, 'index.html');
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(target).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-cache' }); res.end(data);
  });
});
server.on('error', error => { console.error('本地服务未能启动：', error.message); process.exitCode = 1; });
server.listen(4173, '127.0.0.1', () => console.log('打开 http://127.0.0.1:4173 。关闭此窗口即停止服务。'));
