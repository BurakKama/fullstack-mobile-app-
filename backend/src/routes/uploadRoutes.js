const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/product-image', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenmedi' });
  }
  // Dosya bilgileri, filePath'i frontend için URL formatında döndür
  res.json({
    message: 'Dosya yüklendi',
    filePath: '/uploads/' + req.file.filename,
    fileName: req.file.filename
  });
});

module.exports = router;
