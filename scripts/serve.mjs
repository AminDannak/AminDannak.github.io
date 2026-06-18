import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PORT = Number(process.env.PORT || 4173);

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webp": "image/webp",
    ".png": "image/png",
    ".pdf": "application/pdf",
};

const server = createServer(async (req, res) => {
    try {
        const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
        const safePath = pathname.replace(/^\/+/, "") || "index.html";
        const filePath = join(ROOT, safePath);
        const data = await readFile(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
        res.end(data);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
    }
});

server.listen(PORT, () => {
    console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
});

export { PORT, ROOT };
