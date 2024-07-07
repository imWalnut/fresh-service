'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  banner.init({
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '图片必须存在'
        },
        notEmpty: {
          msg: '图片不能为空'
        },
        isUrl: {
          msg: "图片地址格式错误"
        }
      }
    },
    hrefUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '跳转链接必须存在'
        },
        notEmpty: {
          msg: '跳转链接不能为空'
        }
      }
    },
    source: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: {
          msg: '来源必须存在'
        },
        notEmpty: {
          msg: '来源不能为空'
        },
        isIn: {
          args: [[0, 1]],
          msg: "只能为0，1"  // 0首页 1分类页
        }
      }
    },
  }, {
    sequelize,
    modelName: 'banner',
  });
  return banner;
};