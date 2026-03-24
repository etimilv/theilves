# Theilves — Minimal Blog

## Concept & Vision
A clean, distraction-free reading experience. No clutter, no decorations — just thoughtful writing in a format that works perfectly on mobile and desktop. Think a quiet corner of the internet where things are easy to read.

## Design Language
- **Aesthetic**: Editorial minimalism. High contrast, generous whitespace, excellent typography.
- **Colors**:
  - Background: `#fafafa`
  - Text: `#1a1a1a`
  - Secondary text: `#6b6b6b`
  - Accent / links: `#2563eb`
  - Border: `#e5e5e5`
- **Typography**:
  - Headings: `Instrument Serif` (Google Fonts) — elegant, editorial
  - Body: `Instrument Sans` (Google Fonts) — clean, readable
  - Fallback: `Georgia, serif` / `system-ui, sans-serif`
- **Motion**: Subtle — fade-in on load, smooth color transitions on links
- **No images** on the homepage — text-first

## Layout
```
[Nav: Theilves -------- Stocks Dashboard]
[Hero: Name + tagline]
[Posts list: date | title | excerpt]
[Footer: minimal]
```

Single column, max-width 680px, centered. Responsive — works great on mobile.

## Features
- Clean blog post listing with date, title, excerpt
- Posts are expandable inline (no separate pages needed for now)
- Top nav with link to stocks dashboard
- Dark mode toggle (moon/sun icon)

## Pages / Sections
1. **Home** — hero + post list
2. **Posts** — expand inline when clicked

## Technical
- Single HTML file, vanilla CSS + JS
- No build step, no frameworks
- Deployed on Vercel (GitHub-connected)
- Dark mode via CSS class toggle on `<html>`

## Posts (initial content)
1. Building a Personal Homepage (March 2026)
2. Stock Picking Framework (March 2026)
3. Hello World (March 2026)
