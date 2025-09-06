const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/all', businessController.listAll);
router.get('/:businessId/products', businessController.listProducts);

// Protected routes
router.use(authMiddleware);

router.post(
  '/',
  roleMiddleware(['business', 'admin']),
  upload.single('image'),      // Burada işletme resmi yükleniyor
  businessController.create
);

router.put(
  '/update-self',
  roleMiddleware(['business', 'admin']),
  upload.single('image'),      // Güncellemede de resim yükleme
  businessController.updateSelf
);

router.delete('/delete-self', roleMiddleware(['business', 'admin']), businessController.removeSelf);

router.get('/', businessController.list);

module.exports = router;
