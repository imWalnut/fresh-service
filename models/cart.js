'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.cart.belongsTo(models.user, {foreignKey: 'userId', as: 'userInfo'});
      models.cart.belongsTo(models.productSpec, {foreignKey: 'productSpecId', as: 'productSpecInfo'});
    }
  }
  cart.init({
    productSpecId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品规格必须存在'
        },
        notEmpty: {
          msg: '商品规格不能为空'
        }
      }
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户必须存在'
        },
        notEmpty: {
          msg: '用户不能为空'
        }
      }
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品规格总价必须存在'
        },
        notEmpty: {
          msg: '商品规格总价不能为空'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品规格数量必须存在'
        },
        notEmpty: {
          msg: '商品规格数量不能为空'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};