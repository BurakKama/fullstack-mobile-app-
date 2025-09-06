const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Profil GET ve PUT
router.get('/profile', authMiddleware, authController.profile);
router.put('/profile', authMiddleware, authController.update);

router.delete('/delete', authMiddleware, authController.delete);

// Token yenileme
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
