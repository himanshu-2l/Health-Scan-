export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).json({});
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // In serverless environment, we can't use sessions
    // Check if token is provided in query or header
    const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
    
    // For now, return false if no token, true if token exists
    // In production, you'd validate the token
    const connected = !!token;

    return res.status(200).json({
      connected
    });
  } catch (error) {
    console.error('Error checking connection status:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Failed to check connection status',
      message: error.message || 'Unknown error occurred'
    });
  }
}

