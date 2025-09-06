'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('businesses', [{
      name: 'Test İşletme',
      description: 'Bu bir test işletmesidir',
      address: 'Test Adres',
      phone: '5551234567',
      email: 'test@test.com',
      userId: 1, // Admin kullanıcısının ID'si
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('businesses', null, {});
  }
}; 