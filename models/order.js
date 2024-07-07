'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.order.hasMany(models.orderProduct, {foreignKey: 'orderId', as: 'orderProductList'});
      models.order.belongsTo(models.user, {foreignKey: 'userId', as: 'orderUserInfo'});
    }
  }
  order.init({
    orderNo: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户id必须存在'
        },
        notEmpty: {
          msg: '用户id不能为空'
        }
      }
    },
    userCouponId: DataTypes.BIGINT,
    paymentType: DataTypes.INTEGER,
    payment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '支付金额必须存在'
        },
        notEmpty: {
          msg: '支付金额不能为空'
        }
      }
    },
    postage: DataTypes.INTEGER,
    sendTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    closeTime: DataTypes.DATE,
    cancelTime: DataTypes.DATE,
    status: DataTypes.TINYINT.UNSIGNED,
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};