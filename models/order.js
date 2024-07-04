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
      // define association here
    }
  }
  order.init({
    orderNo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userCouponId: DataTypes.BIGINT,
    paymentType: DataTypes.INTEGER,
    payment: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sendTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    closeTime: DataTypes.DATE,
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: {
          msg: '状态必须存在。'
        },
        notEmpty: {
          msg: '状态不能为空。'
        },
        isIn: {
          args: [[0, 1, 2, 3, 4, 5]],
          msg: "只能为0，1, 2, 3, 4, 5"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};