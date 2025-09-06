const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');  // upload middleware
const { productValidation } = require('../validators/productValidator');
const { validationResult } = require('express-validator');

// Validation kontrol middleware'i
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // İsteğe bağlı: eğer dosya yüklendiyse ama validation hatası varsa dosyayı silebilirsin
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Tüm rotalar için auth middleware uygula
router.use(authMiddleware);

// Ürün oluşturma (POST) — önce rol kontrol, sonra dosya upload, validation ve controller
router.post(
  '/',
  roleMiddleware(['business', 'admin']),
  upload.single('image'),
  productValidation,
  validate,
  productController.create
);

// Ürün listeleme (GET) — filtre destekli
router.get('/', productController.list);

// Ürün güncelleme (PUT)
router.put(
  '/:id',
  roleMiddleware(['business', 'admin']),
  upload.single('image'),
  productValidation,
  validate,
  productController.update
);

// Ürün silme (DELETE)
router.delete(
  '/:id',
  roleMiddleware(['business', 'admin']),
  productController.remove
);

// Ürün resmi yükleme (POST)
router.post(
  '/:id/upload-image',
  roleMiddleware(['business', 'admin']),
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productController.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Resim dosyası gerekli" });
      }

      const imageUrl = "/uploads/" + req.file.filename;
      await product.update({ imageUrl });

      res.json({ message: "Resim yüklendi", imageUrl });
    } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ message: "Resim yüklenirken bir hata oluştu" });
    }
  }
);

module.exports = router;
