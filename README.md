# Theilves

A minimal personal blog. Clean, readable, mobile-friendly.

## Stack
Pure HTML + CSS + JavaScript. No build step, no frameworks. Google Fonts (Instrument Serif, Instrument Sans).

## Sections
- **Writing** — notes on investing, technology, building things
- **Stocks Dashboard** — linked in the nav (runs on `localhost:18790`)

## Development
Open `index.html` directly in a browser, or serve locally:
```bash
npx serve .
```

## Deployment
Push to GitHub → Vercel auto-deploys.

## Stocks Dashboard
The dashboard runs as a separate Node.js service on `localhost:18790`. It needs to be running locally to access it.
```bash
cd stocks-dashboard
./start.sh
```
