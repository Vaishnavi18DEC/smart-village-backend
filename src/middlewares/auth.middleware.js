const jwt = require('jsonwebtoken');

// Verifies that the request includes a valid Bearer token
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied: No token provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified; // Contains user_id, email, and role
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Restricts routes to specific roles (e.g., 'taluk', 'panchayat')
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of these roles: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};