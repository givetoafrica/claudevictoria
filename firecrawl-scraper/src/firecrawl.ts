const FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v2";

export interface ScrapeResult {
  url: string;
  markdown: string;
  title?: string;
}

export async function scrapeUrl(url: string, apiKey: string): Promise<ScrapeResult> {
  const response = await fetch(`${FIRECRAWL_BASE_URL}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ url, formats: ["markdown"] }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Firecrawl scrape failed (${response.status}) for ${url}: ${body}`);
  }

  const payload = await response.json();
  if (!payload.success) {
    throw new Error(`Firecrawl scrape returned an error for ${url}: ${JSON.stringify(payload)}`);
  }

  return {
    url,
    markdown: payload.data?.markdown ?? "",
    title: payload.data?.metadata?.title,
  };
}
