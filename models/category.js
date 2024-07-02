'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  category.init({
    categoryId: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '分类名称必须存在。'
        },
        notEmpty: {
          msg: '分类名称不能为空。'
        },
        len: {
          args: [2, 10],
          msg: '姓名长度需要在2 ~ 10个字符之间。'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '分类图片必须存在。'
        },
        notEmpty: {
          msg: '分类图片不能为空。'
        },
        isUrl: {
          msg: "图片地址格式错误"
        }
      }
    },
    parentId: {
      type: DataTypes.STRING,
      allowNull: true,
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
    }
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};