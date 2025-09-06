const { body } = require('express-validator');

exports.productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Ürün adı boş olamaz')
    .isLength({ max: 100 }).withMessage('Ürün adı en fazla 100 karakter olabilir'),

  body('price')
    .notEmpty().withMessage('Fiyat boş olamaz')
    .isFloat({ gt: 0 }).withMessage('Fiyat 0’dan büyük olmalı'),

  body('discounted_price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('İndirimli fiyat 0’dan büyük olmalı'),

  body('quantity')
    .notEmpty().withMessage('Miktar boş olamaz')
    .isInt({ min: 0 }).withMessage('Miktar negatif olamaz'),

  body('category')
    .trim()
    .notEmpty().withMessage('Kategori boş olamaz')
    .isLength({ max: 50 }).withMessage('Kategori en fazla 50 karakter olabilir'),

  body('expiration_date')
    .optional()
    .isISO8601().toDate().withMessage('Geçerli bir son kullanma tarihi girin'),

  body('description')
    .optional()
    .trim()
];
