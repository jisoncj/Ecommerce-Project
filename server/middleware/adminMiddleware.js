/**
 * Admin Middleware
 * Must be used AFTER authMiddleware (needs req.user to exist).
 * Checks if the logged-in user has the 'admin' role.
 */
module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};
