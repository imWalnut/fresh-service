'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  productGroup.init({
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品id必须存在'
        },
        notEmpty: {
          msg: '商品id不能为空'
        }
      }
    },
    groupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '分组id必须存在'
        },
        notEmpty: {
          msg: '分组id不能为空'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'productGroup',
  });
  return productGroup;
};