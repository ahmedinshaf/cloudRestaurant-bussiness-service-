const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Initialize JWKS client
const client = jwksClient({
  jwksUri: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_eQF394Gx5/.well-known/jwks.json`,
});

// Function to retrieve the signing key from JWKS
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// The middleware function
const validateToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1]; // Assumes the token is sent as a Bearer token
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  // Verify the token
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = {
        email:decoded.email
    }
    next(); 
  });
};

module.exports = validateToken;
