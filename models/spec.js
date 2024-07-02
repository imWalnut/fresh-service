'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class spec extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  spec.init({
    specId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '规格名称必须存在。'
        },
        notEmpty: {
          msg: '规格名称不能为空。'
        },
        len: {
          args: [1, 10],
          msg: '规格名称长度需要在1 ~ 10个字符之间。'
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
    }
  }, {
    sequelize,
    modelName: 'spec',
  });
  return spec;
};