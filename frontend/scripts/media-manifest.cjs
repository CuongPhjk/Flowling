const fs = require("fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const { createContents } = require("../src/shared/mock/seed.ts");
fs.mkdirSync("public/media", { recursive: true });
fs.writeFileSync(
  "public/media/manifest.json",
  JSON.stringify(
    createContents()
      .filter((c) => c.type !== "ARTICLE")
      .map((c) => ({
        id: c.id,
        type: c.type,
        title: c.title,
        paragraphs: c.paragraphs,
      })),
    null,
    2,
  ),
);
