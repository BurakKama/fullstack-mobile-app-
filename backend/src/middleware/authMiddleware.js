const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Token gerekli' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Geçersiz ya da pasif kullanıcı' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      user_type: user.user_type
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
  }
};

module.exports = authMiddleware;
