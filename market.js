// Vercel serverless function. Set FINNHUB_API_KEY for stock quotes.
// Crypto prices use CoinGecko's public simple-price endpoint. Gold is a demo fallback unless a provider is added.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  const quotes = {};
  const errors = [];
  try {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr";
    const r = await fetch(url);
    if (!r.ok) throw new Error("CoinGecko HTTP " + r.status);
    const d = await r.json();
    if (d.bitcoin?.inr) quotes.BTC = { price: d.bitcoin.inr, source: "CoinGecko" };
    if (d.ethereum?.inr) quotes.ETH = { price: d.ethereum.inr, source: "CoinGecko" };
  } catch (e) { errors.push("Crypto feed: " + e.message); }

  const token = process.env.FINNHUB_API_KEY;
  if (token) {
    const symbols = { RELIANCE: "NSE:RELIANCE", TCS: "NSE:TCS" };
    for (const [key, symbol] of Object.entries(symbols)) {
      try {
        const r = await fetch("https://finnhub.io/api/v1/quote?symbol=" + encodeURIComponent(symbol) + "&token=" + encodeURIComponent(token));
        const d = await r.json();
        if (r.ok && Number(d.c) > 0) quotes[key] = { price: d.c, source: "Finnhub (provider quote)" };
        else errors.push(key + " quote unavailable");
      } catch (e) { errors.push(key + ": " + e.message); }
    }
  } else {
    errors.push("Set FINNHUB_API_KEY in Vercel for stock quotes.");
  }
  // These are only placeholders until a gold data provider is configured.
  quotes.GOLD = { price: 7200, source: "Demo fallback — configure a gold data provider" };
  return res.status(200).json({
    source: Object.values(quotes).some(q => !String(q.source).includes("Demo fallback")) ? "Live/provider data where available" : "Demo fallback",
    quotes, errors, updatedAt: new Date().toISOString()
  });
}
