const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Profil bilgilerini getir
router.get('/profile', authMiddleware, userController.getProfile);

// Profil bilgilerini güncelle
router.put('/profile', authMiddleware, userController.updateProfile);

// Şifre değiştir
router.put('/change-password', authMiddleware, userController.changePassword);

module.exports = router; 