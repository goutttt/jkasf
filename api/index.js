export default async function handler(req, res) {
  const url = `https://generativelanguage.googleapis.com${req.url.replace('/api/', '/')}`;
  const apiKey = req.headers['x-goog-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const response = await fetch(url, {
    method: req.method,
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
