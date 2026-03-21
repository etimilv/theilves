# Theilves Desktop

A macOS-style personal homepage. Built with vanilla HTML, CSS, and JavaScript.

## Features
- macOS Ventura desktop UI with menu bar, dock, and desktop icons
- Music player with playlist support
- Photo gallery with lightbox
- Stock portfolio tracker (Markets app)
- Finder file browser
- Password-protected private apps
- Live clock

## Setup

### Stock Prices (Finnhub API - Optional)
1. Get a free API key at https://finnhub.io/register
2. Open `index.html` and find `FINNHUB_API_KEY` in the CONFIG section
3. Paste your API key

### Music Files
Add your audio file URLs to `MUSIC_TRACKS` in the CONFIG section.

### Photos
Add Discord CDN image URLs to `PHOTO_URLS` in the CONFIG section.

## Deployment
- Push to GitHub
- Connect repo to Vercel or Netlify
- Auto-deploys on every push

## Tech
- Pure HTML/CSS/JavaScript (no frameworks)
- System fonts (-apple-system, SF Pro)
- Frosted glass effects with backdrop-filter
