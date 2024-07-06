'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  coupon.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '优惠券名称必须存在。'
        },
        notEmpty: {
          msg: '优惠券名称不能为空。'
        },
        len: {
          args: [2, 20],
          msg: '优惠券名称长度需要在2 ~ 20个字符之间。'
        }
      }
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '优惠金额必须存在。'
        },
        notEmpty: {
          msg: '优惠金额不能为空。'
        }
      }
    },
    condition: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'coupon',
  });
  return coupon;
};