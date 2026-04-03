export default async function handler(req, res) {
  // 核心纠错：不管 New API 发过来什么乱七八糟的路径，我们只要最后那部分
  // 比如转发：/v1beta/models/gemini-1.5-flash:generateContent
  const path = req.url.split('?')[0]; 
  const targetUrl = `https://generativelanguage.googleapis.com${path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

  // 兼容 New API 的两种鉴权方式
  const apiKey = req.headers['x-goog-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({ error: "没检测到 API Key，请检查 New API 的密钥设置" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      // 只有 POST 请求才转发 body，避免 GET 请求崩溃
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "服务器内部转发故障: " + error.message });
  }
}
