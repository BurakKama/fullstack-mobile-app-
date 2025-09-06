const { Product, Business } = require("../models");
const { Op } = require("sequelize");

const productController = {
  // Ürün ID'ye göre getir
  async getProductById(id) {
    return await Product.findByPk(id);
  },

  // Ürün oluştur
  async create(req, res) {
    try {
      const {
        name,
        price,
        discounted_price,
        quantity,
        category,
        expiration_date,
        description,
      } = req.body;

      console.log('Received product data:', req.body);

      if (!name || !price || !quantity || !category || !expiration_date) {
        return res.status(400).json({ message: "Tüm alanlar zorunludur." });
      }

      const business = await Business.findOne({ where: { userId: req.user.id } });

      if (!business) {
        return res.status(404).json({ message: "İşletme bulunamadı." });
      }

      const imageUrl = req.file ? "/uploads/" + req.file.filename : null;

      const product = await Product.create({
        name,
        price,
        discounted_price,
        quantity,
        category,
        expiration_date,
        description,
        businessId: business.id,
        imageUrl,
      });

      console.log('Created product:', product.toJSON());

      res.status(201).json({ message: "Ürün oluşturuldu", product });
    } catch (err) {
      console.error("Product.create error:", err);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  },

  // Ürünleri listele (kategori ve arama filtreli)
  async list(req, res) {
    try {
      const { category, search } = req.query;

      const whereClause = {};

      if (category) {
        whereClause.category = { [Op.iLike]: `%${category}%` };
      }

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { category: { [Op.iLike]: `%${search}%` } },
        ];
      }

      console.log("Search:", search);
      console.log("Where clause:", whereClause);

      const products = await Product.findAll({
        where: whereClause,
        include: [{
          model: Business,
          attributes: ['name', 'address', 'phone']
        }]
      });

      res.json({ products });
    } catch (err) {
      console.error("Product.list error:", err);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  },

  // Ürün güncelle
  async update(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }

      const business = await Business.findOne({
        where: { id: product.businessId, userId: req.user.id },
      });

      if (!business) {
        return res
          .status(403)
          .json({ message: "Bu ürünü güncelleme yetkiniz yok" });
      }

      const {
        name,
        price,
        discounted_price,
        quantity,
        category,
        expiration_date,
        description,
      } = req.body;

      if (req.file) {
        product.imageUrl = "/uploads/" + req.file.filename;
      }

      await product.update({
        name,
        price,
        discounted_price,
        quantity,
        category,
        expiration_date,
        description,
      });

      await product.save();

      res.json({ message: "Ürün güncellendi", product });
    } catch (err) {
      console.error("Product.update error:", err);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  },

  // Ürün sil
  async remove(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }

      const business = await Business.findOne({
        where: { id: product.businessId, userId: req.user.id },
      });

      if (!business) {
        return res.status(403).json({ message: "Bu ürünü silme yetkiniz yok" });
      }

      await product.destroy();

      res.json({ message: "Ürün silindi" });
    } catch (err) {
      console.error("Product.remove error:", err);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  },
};

module.exports = productController;
