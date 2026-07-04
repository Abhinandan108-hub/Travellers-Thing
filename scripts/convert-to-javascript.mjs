import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const frontendRoot = path.join(root, "frontend");
const requireFromFrontend = createRequire(path.join(frontendRoot, "package.json"));
const ts = requireFromFrontend("typescript");

const compilerOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2020,
  jsx: ts.JsxEmit.Preserve,
  esModuleInterop: true,
  allowJs: true,
  importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
  isolatedModules: true,
};

function stripTypes(content, fileName) {
  const result = ts.transpileModule(content, {
    compilerOptions,
    fileName,
  });
  return result.outputText;
}

function getOutputPath(inputPath) {
  if (inputPath.endsWith(".tsx")) return inputPath.slice(0, -4) + ".jsx";
  if (inputPath.endsWith(".ts")) return inputPath.slice(0, -3) + ".js";
  return inputPath;
}

function walkDir(dir, extensions, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
      walkDir(full, extensions, files);
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

function convertFile(inputPath, inPlace = false) {
  const content = fs.readFileSync(inputPath, "utf8");
  const outputPath = inPlace ? inputPath : getOutputPath(inputPath);

  const output = stripTypes(content, inputPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output);
  console.log(`OK ${path.relative(root, inputPath)}`);
  return { inputPath, outputPath };
}

// --- Frontend .ts / .tsx ---
const frontendDir = path.join(root, "frontend");
const frontendTsFiles = walkDir(frontendDir, [".ts", ".tsx"]).filter(
  (f) => !f.endsWith(".d.ts"),
);

for (const file of frontendTsFiles) {
  convertFile(file);
}

for (const file of frontendTsFiles) {
  if (file !== getOutputPath(file) && fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

for (const file of walkDir(frontendDir, [".d.ts"])) {
  fs.unlinkSync(file);
}

// --- Root USAGE_EXAMPLES ---
const usageExamples = path.join(root, "USAGE_EXAMPLES.tsx");
if (fs.existsSync(usageExamples)) {
  convertFile(usageExamples);
  fs.unlinkSync(usageExamples);
}

// --- Backend .js (strip remaining TS syntax) ---
const backendSrc = path.join(root, "backend", "src");
const skipBackend = new Set(["cors.d.js"]);

for (const file of walkDir(backendSrc, [".js"])) {
  if (skipBackend.has(path.basename(file)) || file.includes(`${path.sep}types${path.sep}`)) {
    continue;
  }
  convertFile(file, true);
}

for (const file of [
  path.join(backendSrc, "cors.d.js"),
  path.join(backendSrc, "types", "cors.d.js"),
]) {
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

const typesDir = path.join(backendSrc, "types");
if (fs.existsSync(typesDir) && fs.readdirSync(typesDir).length === 0) {
  fs.rmdirSync(typesDir);
}

console.log("\nDone.");
