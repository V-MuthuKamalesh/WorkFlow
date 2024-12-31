const { OAuth2Client } = require('google-auth-library'); 

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.verifyOAuthToken = async (provider="google", token) => {
  if (provider === 'google') {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return { email: payload.email, name: payload.name };
    } catch (error) {
      console.error('Google OAuth token verification failed:', error);
      return null;
    }
  }else {
    throw new Error('Unsupported OAuth provider');
  }
};
