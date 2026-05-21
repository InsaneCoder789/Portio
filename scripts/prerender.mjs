import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const clientIndexPath = path.join(rootDir, "dist", "index.html");
const serverEntryPath = path.join(rootDir, "dist-ssr", "entry-server.js");

const template = await fs.readFile(clientIndexPath, "utf8");
const { render } = await import(pathToFileURL(serverEntryPath).href);

const appHtml = render();
const prerendered = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

await fs.writeFile(clientIndexPath, prerendered, "utf8");
