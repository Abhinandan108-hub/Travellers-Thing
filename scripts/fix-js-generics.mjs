import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "backend", "src");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".js")) files.push(full);
  }
  return files;
}

const genericBeforeParen = /\s*<\s*[A-Za-z_][A-Za-z0-9_.]*\s*>\s*(?=[(\[])/g;

for (const file of walk(root)) {
  let content = fs.readFileSync(file, "utf8");
  const updated = content
    .replace(genericBeforeParen, "")
    .replace(
      /import mongoose, \{ Document, Schema \} from 'mongoose';/g,
      "import mongoose, { Schema } from 'mongoose';",
    )
    .replace(
      /import express, \{ Application \} from 'express';/g,
      "import express from 'express';",
    )
    .replace(/const app: Application = express\(\);/g, "const app = express();");

  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log("Fixed:", path.relative(root, file));
  }
}

console.log("Post-process done.");
