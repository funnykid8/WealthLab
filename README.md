# WealthLab — Financial Life Simulator

A browser-first financial education simulator. Uses virtual money only.

## Included
- Responsive website and browser-local guest save
- Simulated assets, investment portfolio, loans/EMIs, insurance policies and events
- Vercel API route for crypto quotes from CoinGecko and optional stock quotes via Finnhub
- Optional Supabase email/password auth and per-user cloud save
- SQL schema with Row Level Security

## Deploy from the browser (no local Node.js install)
1. Create a GitHub repository and upload all files/folders in this ZIP.
2. Import the repository into Vercel and deploy.
3. Create a Supabase project.
4. In Supabase -> SQL Editor, run `database/schema.sql`.
5. In Vercel -> Project -> Settings -> Environment Variables, add:
   - `SUPABASE_URL` = your Supabase Project URL
   - `SUPABASE_ANON_KEY` = your Supabase anon/public key
   - `FINNHUB_API_KEY` = your Finnhub API key (optional; needed for stock quotes)
6. Redeploy after adding environment variables.

## Market data limitations
- Bitcoin and Ethereum prices are fetched from CoinGecko when its public endpoint is reachable and not rate-limited.
- The stock symbols in `api/market.js` use Finnhub's quote endpoint. Confirm your provider plan supports the symbols/exchange mapping. Prices may be delayed and are not guaranteed to be exchange-grade.
- Gold is explicitly labelled as a demo fallback in this starter. Replace the gold quote section in `api/market.js` with a gold data provider you are licensed to use.
- If the API fails, the interface reports the problem and continues to show saved/demo values.
- Simulated investment purchases never place real orders.

## Account and security notes
- Supabase is optional for guest play. Without environment variables, local guest mode still works.
- Run the SQL before testing cloud saves. Email confirmation settings are controlled in Supabase Auth.
- The browser uses only the Supabase anon/public key. Never expose a Supabase service-role key or market provider secret in frontend JavaScript.
- Cloud save currently stores the student's whole simulation state as JSON. For a production financial education product, migrate money-changing operations to server-side validated ledger transactions, add audit logs, rate limits, account recovery, data export/deletion, and appropriate parental/privacy controls.
- This is an MVP starter, not a production financial, lending, insurance, or investment platform.

## Run locally
Open `index.html` to preview the UI and simulation in guest mode. API endpoints and Supabase auth require deployment to Vercel.
