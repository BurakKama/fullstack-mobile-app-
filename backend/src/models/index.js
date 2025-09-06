const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Business = require('./Business')(sequelize, Sequelize.DataTypes);
db.Product = require('./Product')(sequelize, Sequelize.DataTypes);

// İlişkiler
db.User.hasMany(db.Business, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

db.Business.hasMany(db.Product, {
  foreignKey: 'businessId',
  onDelete: 'CASCADE'
});

db.Business.belongsTo(db.User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

db.Product.belongsTo(db.Business, {
  foreignKey: 'businessId',
  onDelete: 'CASCADE'
});

module.exports = db;