module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_type: {
      type: DataTypes.ENUM('customer', 'business', 'admin'),
      allowNull: false,
      defaultValue: 'customer'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: false
  });
};
