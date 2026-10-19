const http = require("node:http"), fs = require("node:fs"), path = require("node:path");
const root = path.resolve(__dirname, "dist");
// Serve nested fonts as well as scripts; requests stay inside the public directory.
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(req.url.split("?")[0]); }
  catch { res.writeHead(400); res.end("Bad request"); return; }
  const filename = path.resolve(root, pathname === "/" ? "index.html" : "." + pathname);
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.readFile(filename, (err, data) => {
    const types = { ".js": "application/javascript", ".css": "text/css", ".ttf": "font/ttf", ".txt": "text/plain", ".svg": "image/svg+xml" };
    res.writeHead(err ? 404 : 200, { "Content-Type": types[path.extname(filename)] || "text/html" });
    res.end(err ? "Not found" : data);
  });
}).listen(4173, "127.0.0.1", () => console.log("Local: http://127.0.0.1:4173"));
