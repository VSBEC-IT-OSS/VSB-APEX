const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // 1. Check if token exists in request headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided. Please login first.' 
      });
    }

    // 2. Extract token from header
    // Header looks like: "Bearer eyJhbGci..."
    const token = authHeader.split(' ')[1];

    // 3. Verify token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request
    req.user = decoded;

    // 5. Allow request to continue
    next();

  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid or expired token. Please login again.' 
    });
  }
};

module.exports = protect;
