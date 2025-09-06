const { Business, Product } = require('../models');

const businessController = {
  // ✅ Kullanıcının kendi işletmesini oluşturur
  async create(req, res) {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    try {
      const { name, description, address, phone, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: 'İşletme adı ve email gerekli' });
      }

      // Aynı kullanıcı aynı email ile işletme açmış mı?
      const existing = await Business.findOne({
        where: { userId: req.user.id, email }
      });

      if (existing) {
        return res.status(400).json({ message: 'Bu email ile zaten bir işletme var.' });
      }

      // Resim dosyası varsa yolu al
      const imageUrl = req.file ? '/uploads/' + req.file.filename : null;

      const business = await Business.create({
        name,
        description,
        address,
        phone,
        email,
        userId: req.user.id,
        imageUrl
      });

      res.status(201).json({ message: 'İşletme oluşturuldu', business });
    } catch (err) {
      console.error('Business.create error:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  },

  // ✅ Kullanıcının kendi işletmesini günceller
  async updateSelf(req, res) {
    try {
      const userId = req.user.id;
      const { email, ...updateData } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email gerekli' });
      }

      const business = await Business.findOne({ where: { userId, email } });

      if (!business) {
        return res.status(404).json({ message: 'İşletme bulunamadı veya email uyuşmuyor' });
      }

      // Eğer resim dosyası varsa yeni yolu kaydet
      if (req.file) {
        updateData.imageUrl = '/uploads/' + req.file.filename;
      }

      await business.update(updateData);
      res.json({ message: 'İşletme güncellendi', business });
    } catch (err) {
      console.error('Business.updateSelf error:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  },

  // ✅ Kullanıcının kendi işletmesini siler
  async removeSelf(req, res) {
    try {
      const userId = req.user.id;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email gerekli' });
      }

      const business = await Business.findOne({ where: { userId, email } });

      if (!business) {
        return res.status(404).json({ message: 'İşletme bulunamadı veya email uyuşmuyor' });
      }

      await business.destroy();
      res.json({ message: 'İşletme silindi' });
    } catch (err) {
      console.error('Business.removeSelf error:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  },

  // ✅ Kullanıcının kendi işletmelerini listeler
  async list(req, res) {
    try {
      const businesses = await Business.findAll({ where: { userId: req.user.id } });
      res.json({ businesses });
    } catch (err) {
      console.error('Business.list error:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  },

  // ✅ Tüm işletmeleri listeler
  async listAll(req, res) {
    try {
      const businesses = await Business.findAll({
        attributes: ['id', 'name', 'description', 'address', 'phone', 'email', 'imageUrl']
      });
      res.json({ businesses });
    } catch (err) {
      console.error('Business.listAll error:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  },

  // ✅ İşletmenin ürünlerini listeler
  async listProducts(req, res) {
    try {
      const { businessId } = req.params;
      const products = await Product.findAll({
        where: { businessId },
        attributes: ['id', 'name', 'description', 'price', 'discounted_price', 'quantity', 'category', 'expiration_date', 'imageUrl']
      });
      res.json({ products });
    } catch (err) {
      console.error('Business.listProducts error:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }
};

module.exports = businessController;
