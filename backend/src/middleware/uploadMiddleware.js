const multer = require('multer');
const path = require('path');
const fs = require('fs');   


const uploadDir = 'uploads/';

// Klasör yoksa oluştur
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Dosya kaydetme dizini
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Projende 'uploads' klasörü olmalı
  },
  filename: function (req, file, cb) {
    // Dosya adı benzersiz yapılıyor
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Dosya filtresi (sadece resim kabul et)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyalarına izin verilir'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
