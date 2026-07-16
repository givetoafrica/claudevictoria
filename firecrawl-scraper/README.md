# firecrawl-scraper

A small CLI that scrapes one or more URLs into clean markdown using [Firecrawl](https://firecrawl.dev).

## Setup

```bash
cd firecrawl-scraper
npm install
cp .env.example .env
# edit .env and set FIRECRAWL_API_KEY=fc-...
```

## Usage

```bash
npm run scrape -- https://example.com https://firecrawl.dev
```

Each URL is scraped via the Firecrawl `/scrape` API and saved as markdown under `output/`.
