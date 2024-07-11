'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class authority extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.authority.belongsTo(models.user, {foreignKey: 'userId'});
    }
  }
  authority.init({
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '姓名必须存在'
        },
        notEmpty: {
          msg: '姓名不能为空'
        },
        len: {
          args: [2, 6],
          msg: '姓名长度需要在2 ~ 6个字符之间'
        }
      }
    },
    sex: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: {
          msg: '性别必须存在'
        },
        notEmpty: {
          msg: '性别不能为空'
        },
        isIn: {
          args: [[0, 1]],
          msg: "只能为0，1"  // 0男 1女
        }
      }
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false
    },
    shopName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: {
          msg: '状态必须存在'
        },
        notEmpty: {
          msg: '状态不能为空'
        },
        isIn: {
          args: [[0, 1, 2]],
          msg: "只能为0，1, 2"  // 0待审核 1已通过 2已驳回
        }
      }
    },
  }, {
    sequelize,
    modelName: 'authority',
  });
  return authority;
};