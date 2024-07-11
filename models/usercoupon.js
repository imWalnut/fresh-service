'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.userCoupon.belongsTo(models.user, {foreignKey: 'userId'});
    }
  }
  userCoupon.init({
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
    endDate: DataTypes.DATE,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '名称必须存在'
        },
        notEmpty: {
          msg: '名称不能为空'
        }
      }
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '优惠金额必须存在'
        },
        notEmpty: {
          msg: '优惠金额不能为空'
        }
      }
    },
    condition: {
      type: DataTypes.INTEGER
    },
    remark: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'userCoupon',
  });
  return userCoupon;
};