'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.category.hasMany(models.product, {foreignKey: 'categoryId'});
    }
  }
  category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '分类名称必须存在'
        },
        notEmpty: {
          msg: '分类名称不能为空'
        },
        len: {
          args: [2, 10],
          msg: '姓名长度需要在2 ~ 10个字符之间'
        }
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '分类图片必须存在'
        },
        notEmpty: {
          msg: '分类图片不能为空'
        },
        isUrl: {
          msg: "图片地址格式错误"
        }
      }
    },
    commission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '提成比例必须存在'
        },
        notEmpty: {
          msg: '提成比例不能为空'
        },
        isGreaterThan0AndLessThan100(value) {
          if (value < 0 || value >= 100) {
            throw new Error('提成比例应大于等于0小于100');
          }
        }
      }
    },
    parentId: {
      type: DataTypes.BIGINT
    },
    remark: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};