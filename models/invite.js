'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.invite.belongsTo(models.user, {foreignKey: 'userId'});
    }
  }
  invite.init({
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    invitedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '邀请人手机号码必须存在'
        },
        notEmpty: {
          msg: '邀请人手机号码不能为空'
        },
        is: {
          args: /^1((34[0-8])|(8\d{2})|(([0-35-9]|4|66|7|9)\d{1}))\d{7}$/i,
          msg: "手机号码格式错误"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'invite',
  });
  return invite;
};