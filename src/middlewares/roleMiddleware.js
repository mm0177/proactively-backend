const roleMiddleware = (allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send('Access forbidden.');
    }
    next();
  };
  
  module.exports = roleMiddleware;
  