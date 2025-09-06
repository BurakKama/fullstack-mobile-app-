module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Business",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageUrl: { 
        type: DataTypes.STRING,
         allowNull: true ,
           field: 'imageUrl'
        },
    },
    {
      tableName: "businesses",
      timestamps: true,
    }
  );
};
