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
      models.orderProduct.belongsTo(models.order, {foreignKey: 'orderId', as: 'orderProductList'});
    }
  }
  orderProduct.init({
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specNum: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    specPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'orderProduct',
  });
  return orderProduct;
};