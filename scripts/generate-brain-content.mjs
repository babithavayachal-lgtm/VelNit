#!/usr/bin/env node
/**
 * Compiles brain/*.md (the source-of-truth VRIF, TALK, Writing DNA, and
 * Knowledge Graph documents) into a single generated TypeScript module of
 * string constants: lib/ai/brain-content.generated.ts.
 *
 * We generate a TS module rather than reading the markdown files with fs
 * at runtime because Next.js/Netlify's serverless bundler only includes
 * files that are actually imported by the code graph - an ad-hoc
 * fs.readFileSync() call on a path outside that graph can silently 404 in
 * production even though it works locally. Baking the content into an
 * imported .ts module sidesteps that whole class of bug.
 *
 * Run automatically before every build (see package.json "prebuild"), and
 * manually via `npm run generate:brain` whenever brain/*.md changes.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const sources = [
  { name: "VRIF_MD", file: "brain/02_VRIF.md" },
  { name: "TALK_MD", file: "brain/03_TALK_Model.md" },
  { name: "WRITING_DNA_MD", file: "brain/04_Writing_DNA.md" },
  { name: "KNOWLEDGE_GRAPH_MD", file: "brain/05_Knowledge_Graph.md" },
];

function toTemplateLiteral(text) {
  // Escape backtick, backslash, and ${ so the content is a safe template literal.
  return text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

const banner = `/**
 * GENERATED FILE - do not edit by hand.
 * Source: brain/*.md
 * Regenerate with: npm run generate:brain
 */
`;

const exports = sources
  .map(({ name, file }) => {
    const text = readFileSync(path.join(root, file), "utf8");
    return `export const ${name} = \`${toTemplateLiteral(text)}\`;\n`;
  })
  .join("\n");

const outPath = path.join(root, "lib/ai/brain-content.generated.ts");
writeFileSync(outPath, banner + "\n" + exports);
console.log(`Generated ${path.relative(root, outPath)} from ${sources.length} brain documents.`);
