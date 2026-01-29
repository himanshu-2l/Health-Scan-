export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;

    if (!code) {
      const frontendUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}?error=no_code`);
    }

    // Use dynamic import for googleapis
    const { google } = await import('googleapis');
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/auth/google/callback`;
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    // Encode tokens to send to frontend
    const tokenString = Buffer.from(JSON.stringify(tokens)).toString('base64');

    const frontendUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    
    return res.redirect(`${frontendUrl}/dashboard?google_fit=connected&token=${encodeURIComponent(tokenString)}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const frontendUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}?error=auth_failed&message=${encodeURIComponent(error.message || 'Unknown error')}`);
  }
}

