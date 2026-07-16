import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { scrapeUrl } from "./firecrawl.js";

function slugify(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function main() {
  const urls = process.argv.slice(2);
  if (urls.length === 0) {
    console.error("Usage: npm run scrape -- <url> [url2] [url3] ...");
    process.exit(1);
  }

  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.error("Missing FIRECRAWL_API_KEY. Copy .env.example to .env and set your key.");
    process.exit(1);
  }

  const outDir = path.resolve("output");
  await mkdir(outDir, { recursive: true });

  for (const url of urls) {
    try {
      console.log(`Scraping ${url} ...`);
      const result = await scrapeUrl(url, apiKey);
      const outPath = path.join(outDir, `${slugify(url)}.md`);
      await writeFile(outPath, result.markdown, "utf-8");
      console.log(`  saved -> ${outPath}`);
    } catch (err) {
      console.error(`  failed: ${(err as Error).message}`);
    }
  }
}

main();
