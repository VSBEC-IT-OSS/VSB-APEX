const restrictTo = (...roles) => {
  return (req, res, next) => {
    // 1. Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Only ${roles.join(' or ')} can access this.`
      });
    }

    // 2. Role is allowed — continue
    next();
  };
};

module.exports = restrictTo;