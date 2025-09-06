const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const { User, Business } = require('../models');

const authController = {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await authService.register(req.body);
      res.status(201).json({
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('Register error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
      }
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  },

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        message: 'Giriş başarılı',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ message: error.message });
    }
  },

  // Profil bilgisi GET — kullanıcı ve business (varsa) ile dön
  async profile(req, res) {
    try {
      let user = req.user;
      // Eğer business kullanıcısıysa, business kaydını da ekle
      if (user.user_type === 'business') {
        const business = await Business.findOne({ where: { userId: user.id } });
        user = { ...user, business: business ? business.toJSON() : null };
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Profil alınırken hata oluştu' });
    }
  },

  // Profil güncelleme PUT — güncellenen kullanıcıyı dön
  async update(req, res) {
    try {
      const updatedUser = await authService.updateUser(req.user.id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await authService.deleteUser(req.user.id);
      res.status(200).json({ message: 'Hesabınız silindi' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Token yenileme
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token gerekli' });
      }

      // Refresh token'ı doğrula
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Kullanıcıyı bul
      const user = await User.findOne({ where: { id: decoded.id } });
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      // Yeni token oluştur
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Yeni refresh token oluştur
      const newRefreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ 
        token,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      console.error('Token yenileme hatası:', error);
      res.status(401).json({ message: 'Geçersiz refresh token' });
    }
  }
};

module.exports = authController;
