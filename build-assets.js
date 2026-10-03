const fs = require("fs");
const path = require("path");

// Папки, которые не нужно включать в список
const IGNORE_DIRS = new Set([".git", "node_modules", ".github"]);

// Файлы, которые тоже не должны попасть в список
const IGNORE_FILES = new Set(["ASSETS.txt", "build-assets.js"]);

const files = [];

(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(".", full).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(full);
    } else {
      if (IGNORE_FILES.has(entry.name)) continue;
      files.push("/" + rel);
    }
  }
})(".");

// Сортируем, чтобы результат был стабильным между запусками
files.sort();

// Записываем в ASSETS.txt в виде JS-массива
fs.writeFileSync("ASSETS.txt", JSON.stringify(files, null, 2) + "\n");

console.log(`Записано ${files.length} файлов в ASSETS.txt`);
