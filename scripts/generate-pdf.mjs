import { existsSync } from "node:fs";
import { readFile as readFileAsync } from "node:fs/promises";
import { createServer } from "node:http";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PORT = 4173;

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
};

const SYSTEM_CHROME_PATHS = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
];

function resolveChromePath() {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        return process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    try {
        const bundled = puppeteer.executablePath();
        if (bundled && existsSync(bundled)) {
            return bundled;
        }
    } catch {
        // Puppeteer browser not downloaded yet.
    }

    return SYSTEM_CHROME_PATHS.find((path) => existsSync(path));
}

function startServer() {
    return new Promise((resolve) => {
        const server = createServer(async (req, res) => {
            try {
                const pathname = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);
                const safePath = pathname.replace(/^\/+/, "") || "resume.html";
                const filePath = join(ROOT, safePath);
                const data = await readFileAsync(filePath);
                const ext = extname(filePath);
                res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
                res.end(data);
            } catch {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("Not found");
            }
        });

        server.listen(PORT, () => resolve(server));
    });
}

async function main() {
    const resumeData = JSON.parse(await readFileAsync(join(ROOT, "resume.json"), "utf8"));
    const outputPath = join(ROOT, resumeData.meta.pdfFilename);
    const server = await startServer();
    const chromePath = resolveChromePath();
    const launchOptions = {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };

    if (chromePath) {
        launchOptions.executablePath = chromePath;
    }

    const browser = await puppeteer.launch(launchOptions);

    try {
        const page = await browser.newPage();
        page.on("pageerror", (error) => console.error("Page error:", error.message));

        await page.evaluateOnNewDocument((data) => {
            window.__RESUME_DATA__ = data;
        }, resumeData);

        await page.goto(`http://localhost:${PORT}/resume.html`, {
            waitUntil: "networkidle0",
        });
        await page.waitForSelector("body[data-rendered='true']", { timeout: 15000 });

        await page.pdf({
            path: outputPath,
            format: "Letter",
            printBackground: true,
            margin: {
                top: "0.45in",
                right: "0.55in",
                bottom: "0.45in",
                left: "0.55in",
            },
        });

        console.log(`Generated ${outputPath}`);
    } finally {
        await browser.close();
        server.close();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
