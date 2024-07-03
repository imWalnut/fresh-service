'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  orderProduct.init({
    productId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: DataTypes.INTEGER.UNSIGNED
  }, {
    sequelize,
    modelName: 'orderProduct',
  });
  return orderProduct;
};