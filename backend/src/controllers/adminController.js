const { User, Business, Product } = require("../models");

const adminController = {
  // 1. Kullanıcıları listeleme
  async listUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const { count, rows: users } = await User.findAndCountAll({
        attributes: { exclude: ["password"] },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        totalUsers: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        users,
      });
    } catch (error) {
      console.error("listUsers error:", error);
      res.status(500).json({ message: "Kullanıcılar getirilemedi" });
    }
  },

  // 2. Kullanıcı rolünü güncelleme
  async updateUserRole(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { user_type } = req.body;
      const validRoles = ["customer", "business", "admin"];

      if (!validRoles.includes(user_type)) {
        return res.status(400).json({ message: "Geçersiz kullanıcı tipi" });
      }

      if (req.user.id === id) {
        return res
          .status(400)
          .json({ message: "Kendi rolünüzü değiştiremezsiniz" });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }

      user.user_type = user_type;
      await user.save();

      res.json({ message: "Kullanıcı rolü başarıyla güncellendi", user });
    } catch (error) {
      console.error("updateUserRole error:", error);
      res.status(500).json({ message: "Kullanıcı rolü güncellenemedi" });
    }
  },

  // 3. Kullanıcı silme
  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (req.user.id === id) {
        return res
          .status(400)
          .json({ message: "Kendi hesabınızı silemezsiniz" });
      }

      const deleted = await User.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }

      res.json({ message: "Kullanıcı başarıyla silindi" });
    } catch (error) {
      console.error("deleteUser error:", error);
      res.status(500).json({ message: "Kullanıcı silinemedi" });
    }
  },

  // 4. İşletmeleri listele
  async listBusinesses(req, res) {
    try {
      const businesses = await Business.findAll({
        include: { model: User, attributes: ["id", "full_name", "email"] },
        order: [["createdAt", "DESC"]],
      });
      res.json({ businesses });
    } catch (error) {
      console.error("listBusinesses error:", error);
      res.status(500).json({ message: "İşletmeler getirilemedi" });
    }
  },

  // 5. İşletme güncelleme
  async updateBusiness(req, res) {
    try {
      const id = parseInt(req.params.id);
      const business = await Business.findByPk(id);
      if (!business) {
        return res.status(404).json({ message: "İşletme bulunamadı" });
      }
      await business.update(req.body);
      res.json({ message: "İşletme başarıyla güncellendi", business });
    } catch (error) {
      console.error("updateBusiness error:", error);
      res.status(500).json({ message: "İşletme güncellenemedi" });
    }
  },

  // 6. İşletme sil
  async deleteBusiness(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await Business.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: "İşletme bulunamadı" });
      }
      res.json({ message: "İşletme başarıyla silindi" });
    } catch (error) {
      console.error("deleteBusiness error:", error);
      res.status(500).json({ message: "İşletme silinemedi" });
    }
  },

  // 7. Ürünleri listele
  async listProducts(req, res) {
    try {
      const products = await Product.findAll({
        include: { model: Business, attributes: ["id", "name"] },
        order: [["createdAt", "DESC"]],
      });
      res.json({ products });
    } catch (error) {
      console.error("listProducts error:", error);
      res.status(500).json({ message: "Ürünler getirilemedi" });
    }
  },

  // 8. Ürün güncelleme
  async updateProduct(req, res) {
    try {
      const id = parseInt(req.params.id);
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
      await product.update(req.body);
      res.json({ message: "Ürün başarıyla güncellendi", product });
    } catch (error) {
      console.error("updateProduct error:", error);
      res.status(500).json({ message: "Ürün güncellenemedi" });
    }
  },

  // 9. Ürün silme
  async deleteProduct(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await Product.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
      res.json({ message: "Ürün başarıyla silindi" });
    } catch (error) {
      console.error("deleteProduct error:", error);
      res.status(500).json({ message: "Ürün silinemedi" });
    }
  },
};

module.exports = adminController;
