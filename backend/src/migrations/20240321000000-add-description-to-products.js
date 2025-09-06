'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('products', 'description', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('products', 'description');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }
}; 