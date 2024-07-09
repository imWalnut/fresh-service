'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.group.hasMany(models.productGroup, {foreignKey: 'groupId'});
    }
  }
  group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '分组名称必须存在'
        },
        notEmpty: {
          msg: '分组名称不能为空'
        },
        len: {
          args: [1, 20],
          msg: '分组名称长度需要在1 ~ 20个字符之间'
        }
      }
    },
    remark: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'group',
  });
  return group;
};