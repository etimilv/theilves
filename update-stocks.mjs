#!/usr/bin/env node
// Updates stocks.json from databases + live prices, commits to GitHub
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname);
const DB_IDEAS = '/home/timilv/.openclaw/workspace/stock_ideas.db';
const DB_PORT = '/home/timilv/.openclaw/workspace/portfolio.db';
const GITHUB_TOKEN = process.env.GH_TOKEN;
const REPO = 'https://github.com/etimilv/theilves.git';

async function fetchPrice(ticker) {
  try {
    const { get } = await import('node:https');
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    const data = await new Promise((resolve, reject) => {
      get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(d));
      }).on('error', reject);
    });
    const json = JSON.parse(data);
    return json?.chart?.result?.[0]?.meta?.regularMarketPrice || null;
  } catch (e) {
    return null;
  }
}

async function update() {
  console.log('Fetching stock ideas...');
  const dbIdeas = new Database(DB_IDEAS, { readonly: true });
  const dbPort = new Database(DB_PORT, { readonly: true });

  const ideas = dbIdeas.prepare(`
    SELECT ticker, name, rating, status, sector, country, exchange,
           investment_rationale, short_overview, next_catalyst_date, next_catalyst_description,
           next_earnings_date, next_dividend_ex_date, dividend_yield_pct
    FROM stock_ideas
    ORDER BY status = 'completed' DESC, rating DESC, date_added DESC
  `).all();

  const positions = dbPort.prepare('SELECT * FROM positions').all();
  
  dbIdeas.close();
  dbPort.close();

  console.log(`Got ${ideas.length} stock ideas, ${positions.length} positions`);

  // Fetch live prices
  const prices = {};
  const tickers = [...new Set([...ideas.map(i => i.ticker), ...positions.map(p => p.ticker)])];
  
  for (const ticker of tickers) {
    const price = await fetchPrice(ticker);
    prices[ticker] = price;
    if (price) {
      console.log(`  ${ticker}: $${price.toFixed(2)}`);
    } else {
      console.log(`  ${ticker}: price unavailable`);
    }
    await new Promise(r => setTimeout(r, 200)); // Rate limit
  }

  // Build JSON
  const output = {
    updated: new Date().toISOString(),
    stockIdeas: ideas.map(s => ({
      ticker: s.ticker,
      name: s.name,
      rating: s.rating,
      sector: s.sector,
      country: s.country,
      exchange: s.exchange,
      rationale: s.investment_rationale,
      overview: s.short_overview,
      nextCatalystDate: s.next_catalyst_date,
      nextCatalystDesc: s.next_catalyst_description,
      nextEarningsDate: s.next_earnings_date,
      dividendDate: s.next_dividend_ex_date,
      dividendYield: s.dividend_yield_pct,
      price: prices[s.ticker] || null,
    })),
    portfolio: positions.map(p => {
      const price = prices[p.ticker] || p.current_price || 0;
      const value = p.shares ? p.shares * price : price;
      const cost = p.shares && p.entry_price ? p.shares * p.entry_price : price;
      return {
        ticker: p.ticker,
        shares: p.shares,
        entryPrice: p.entry_price,
        currentPrice: price,
        value: value,
        gain: value - cost,
        gainPct: cost > 0 ? ((value - cost) / cost * 100) : 0,
      };
    }),
  };

  // Write to stocks.json in repo
  const outPath = resolve(REPO_DIR, 'stocks.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Written to ${outPath}`);

  // Git commit and push
  try {
    const { execSync } = await import('node:child_process');
    const remoteUrl = `https://${GITHUB_TOKEN}@github.com/etimilv/theilves.git`;
    execSync(`git remote set-url origin ${remoteUrl}`, { cwd: REPO_DIR });
    execSync('git add stocks.json', { cwd: REPO_DIR });
    execSync('git commit -m "Update stocks data"', { cwd: REPO_DIR });
    execSync('git push', { cwd: REPO_DIR });
    console.log('Pushed to GitHub');
  } catch (e) {
    console.error('Git push failed:', e.message);
  }
}

update().catch(console.error);
