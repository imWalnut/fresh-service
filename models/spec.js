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
      // specInfo
    }
  }
  spec.init({
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