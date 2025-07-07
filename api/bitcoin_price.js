export default async function handler(req, res) {
  const apiKey = "2286409f-f924-4b24-822c-504b605a5adf";
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical?symbol=BTC&convert=USD&time_start=2010-01-01&time_end=2025-07-07`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data from CoinMarketCap" });
    }

    const data = await response.json();

    // Simplify the data to date and closing price
    const prices = data.data.quotes.map(quote => ({
      date: quote.time_open.split("T")[0],  // only date part
      price: quote.quote.USD.close           // closing price
    }));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ data: prices });
  } catch (error) {
    res.status(500).json({ error: "Server error fetching price data" });
  }
}
