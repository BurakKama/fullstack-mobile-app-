const { body } = require("express-validator");

exports.registerValidation = [
  body("full_name").trim().notEmpty().withMessage("İsim boş olamaz").escape(),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Geçerli bir email adresi girin")
    .normalizeEmail(),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Şifre en az 6 karakter olmalı"),

  body("user_type")
    .optional()
    .isIn(["customer", "business", "admin"])
    .withMessage("Geçersiz kullanıcı tipi"),
];

exports.loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Geçerli bir email girin")
    .normalizeEmail(),

  body("password").trim().notEmpty().withMessage("Şifre gerekli"),

  body("user_type")
    .optional()
    .isIn(["customer", "business", "admin"])
    .withMessage("Geçersiz kullanıcı tipi"), // admin eklendi
];
