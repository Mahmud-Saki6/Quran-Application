/**
 * Next.js injects global CSS <link> before custom <head> children, so the theme
 * script can run after styles apply — causing a light flash for dark mode users.
 * After static export, move #theme-init to immediately after <head> so it runs
 * during parse before the stylesheet paints.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "out");
const SCRIPT_RE =
  /<script\b[^>]*\bid="theme-init"[^>]*>[\s\S]*?<\/script>/i;

async function walkHtml(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walkHtml(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

async function main() {
  let files;
  try {
    files = await walkHtml(OUT);
  } catch {
    console.warn("ensure-theme-script-first: no out/ folder; skip.");
    process.exit(0);
  }

  let changed = 0;
  for (const file of files) {
    let html = await readFile(file, "utf8");
    const m = html.match(SCRIPT_RE);
    if (!m) continue;
    const tag = m[0];
    const without = html.replace(SCRIPT_RE, "");
    if (without === html) continue;
    if (!/<head[^>]*>/i.test(without)) continue;
    const next = without.replace(
      /<head[^>]*>/i,
      (open) => `${open}${tag}`,
    );
    if (next !== without) {
      await writeFile(file, next, "utf8");
      changed += 1;
    }
  }
  if (changed) {
    console.log(
      `ensure-theme-script-first: moved theme script in ${changed} HTML file(s).`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
