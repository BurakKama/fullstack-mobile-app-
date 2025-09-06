const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.user_type)) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    next();
  };
};

module.exports = roleMiddleware;
