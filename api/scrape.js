export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter required" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch: ${response.statusText}` });
    }

    const html = await response.text();
    
    return res.status(200).json({ contents: html });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch URL" });
  }
}
