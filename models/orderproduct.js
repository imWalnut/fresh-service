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
      models.orderProduct.belongsTo(models.productSpec, {foreignKey: 'productSpecId', as: 'orderProductSpecInfo'});
      models.orderProduct.belongsTo(models.order, {foreignKey: 'orderId', as: 'orderProductList'});
    }
  }
  orderProduct.init({
    productSpecId: {
      type: DataTypes.BIGINT,
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