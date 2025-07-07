export default async function handler(req, res) {
  const token = "YOUR_API_KEY";
  const marketcapUrl = `https://api.researchbitcoin.net/v1/marketcap/market_cap?token=${token}&date_field=2011-01-01&output_format=json`;
  const supplyUrl = `https://api.researchbitcoin.net/v1/supply_distribution/supply_total?token=${token}&date_field=2011-01-01&output_format=json`;

  try {
    const [marketcapRes, supplyRes] = await Promise.all([
      fetch(marketcapUrl),
      fetch(supplyUrl)
    ]);

    if (!marketcapRes.ok || !supplyRes.ok) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    const marketcapData = await marketcapRes.json();
    const supplyData = await supplyRes.json();

    // Match data by date and calculate price
    const priceData = marketcapData.data.map(mc => {
      const supplyItem = supplyData.data.find(s => s.date === mc.date);
      if (!supplyItem || supplyItem.supply_total === 0) return null;

      return {
        date: mc.date,
        price: mc.market_cap / supplyItem.supply_total
      };
    }).filter(Boolean);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ data: priceData });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
