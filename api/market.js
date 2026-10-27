
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

  const quotes = {};
  const errors = [];
  const key = process.env.FINNHUB_API_KEY;

  if (key) {
    for (const [id, symbol] of [
      ["RELIANCE", "NSE:RELIANCE"],
      ["TCS", "NSE:TCS"]
    ]) {
      try {
        const response = await fetch(
          "https://finnhub.io/api/v1/quote?symbol=" +
          encodeURIComponent(symbol) +
          "&token=" + encodeURIComponent(key)
        );
        if (!response.ok) throw new Error("HTTP " + response.status);

        const data = await response.json();
        const price = Number(data.c);

        if (price > 0 && Number.isFinite(price)) {
          quotes[id] = {
            price,
            source: "Finnhub",
            currency: "INR"
          };
        } else {
          errors.push(id + ": no valid quote; check symbol access");
        }
      } catch (error) {
        errors.push(id + ": " + error.message);
      }
    }
  } else {
    errors.push("FINNHUB_API_KEY is missing in Vercel.");
  }

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr"
    );
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();

    if (data.bitcoin?.inr > 0) {
      quotes.BTC = {
        price: data.bitcoin.inr,
        source: "CoinGecko",
        currency: "INR"
      };
    }
    if (data.ethereum?.inr > 0) {
      quotes.ETH = {
        price: data.ethereum.inr,
        source: "CoinGecko",
        currency: "INR"
      };
    }
  } catch (error) {
    errors.push("Crypto: " + error.message);
  }

  return res.status(200).json({
    quotes,
    errors,
    updatedAt: new Date().toISOString()
  });
}
