export default async function handler(req, res) {
  // 核心：直接把 Vercel 接收到的所有路径拼到 Google 官方接口后面
  const targetUrl = `https://generativelanguage.googleapis.com${req.url}`;
  
  const apiKey = req.headers['x-goog-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "代理请求失败: " + error.message });
  }
}
