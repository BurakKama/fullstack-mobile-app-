const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT secret keyleri kontrol et
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret_key_2024';

class AuthService {
  async register({ full_name, email, password, user_type }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Bu email adresi zaten kullanımda');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      user_type
    });

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        user_type: user.user_type
      },
      token,
      refreshToken
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Geçersiz email veya şifre');
    }
    if (user.status !== 'active') {
      throw new Error('Hesabınız aktif değil');
    }

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        user_type: user.user_type
      },
      token,
      refreshToken
    };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Kullanıcı bulunamadı');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      user_type: user.user_type
    };
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Kullanıcı bulunamadı');
    await user.destroy();
  }
}

module.exports = new AuthService();
