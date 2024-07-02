'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productSpec extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  productSpec.init({
    productIdSpecId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品必须存在'
        },
        notEmpty: {
          msg: '商品不能为空'
        }
      }
    },
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
          args: [[0, 1]],
          msg: "只能为0，1"
        }
      }
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specId: {
      type: DataTypes.STRING,
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
    specAmount: {
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
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品价格必须存在'
        },
        notEmpty: {
          msg: '商品价格不能为空'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'productSpec',
  });
  return productSpec;
};