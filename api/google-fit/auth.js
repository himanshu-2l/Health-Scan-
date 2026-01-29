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

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/auth/google/callback`;

    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        envKeys: Object.keys(process.env).filter(k => k.includes('GOOGLE'))
      });
      return res.status(500).json({ 
        error: 'Google OAuth credentials not configured',
        message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables',
        debug: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret
        }
      });
    }

    // Try to import googleapis with better error handling
    let google;
    try {
      // Try different import patterns for compatibility
      const googleapisModule = await import('googleapis');
      
      // Handle different export structures
      if (googleapisModule.google) {
        google = googleapisModule.google;
      } else if (googleapisModule.default && googleapisModule.default.google) {
        google = googleapisModule.default.google;
      } else if (googleapisModule.default) {
        google = googleapisModule.default;
      } else {
        google = googleapisModule;
      }
      
      // Verify the structure
      if (!google || typeof google !== 'object' || !google.auth) {
        console.error('Invalid googleapis structure:', {
          hasGoogle: !!google,
          googleType: typeof google,
          hasAuth: !!(google && google.auth),
          keys: google ? Object.keys(google).slice(0, 10) : []
        });
        throw new Error('googleapis module structure is invalid - auth property not found');
      }
    } catch (importError) {
      console.error('Failed to import googleapis:', {
        message: importError.message,
        name: importError.name,
        stack: importError.stack,
        code: importError.code
      });
      return res.status(500).json({
        error: 'Failed to load Google APIs library',
        message: importError.message || 'Could not import googleapis module',
        type: importError.name || 'ImportError',
        code: importError.code || 'UNKNOWN',
        hint: 'Make sure googleapis is installed: npm install googleapis'
      });
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/fitness.activity.read',
          'https://www.googleapis.com/auth/fitness.heart_rate.read',
          'https://www.googleapis.com/auth/fitness.sleep.read',
          'https://www.googleapis.com/auth/fitness.body.read',
        ],
        prompt: 'consent',
      });

      return res.status(200).json({ 
        authUrl 
      });
    } catch (oauthError) {
      console.error('OAuth2 client error:', oauthError);
      return res.status(500).json({
        error: 'Failed to create OAuth2 client',
        message: oauthError.message || 'Unknown OAuth error',
        type: oauthError.name || 'OAuthError'
      });
    }
  } catch (error) {
    console.error('Unexpected error in Google auth:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Failed to generate auth URL',
      message: error.message || 'Unknown error occurred',
      type: error.name || 'Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

