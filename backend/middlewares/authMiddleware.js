const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header or x-access-token header
    // Supports: "Authorization: Bearer <token>" and raw token in x-access-token
    let token;
    const authHeader = req.headers.authorization || req.headers['x-access-token'];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (authHeader) {
      token = authHeader; // fallback: raw token provided
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token and fetch user
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // All good -> continue
      return next();
    } catch (err) {
      // <<-- CHANGED: Explicit handling for expired tokens so client can react accordingly
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token expired',
          error: err.message,
          expiredAt: err.expiredAt // useful for debugging on the client
        });
      }

      // Any other verification error
      return res.status(401).json({ message: 'Token failed', error: err.message });
    }
  } catch (error) {
    // Unexpected server error
    res.status(500).json({ message: "Server error in auth middleware", error: error.message });
  }
};

//Middleware for Admin Only Access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

module.exports = { protect, adminOnly };