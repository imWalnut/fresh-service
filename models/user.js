'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(models.cart, {foreignKey: 'userId', as: 'userInfo'});
      models.user.hasMany(models.userCoupon, {foreignKey: 'userId'});
      models.user.hasMany(models.order, {foreignKey: 'userId', as: 'orderUserInfo'});
      models.user.hasMany(models.address, {foreignKey: 'userId'});
      models.user.hasMany(models.authority, {foreignKey: 'userId'});
      models.user.hasMany(models.invite, {foreignKey: 'userId'});
    }
  }
  user.init({
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '手机号码必须存在'
        },
        notEmpty: {
          msg: '手机号码不能为空'
        },
        is: {
          args: /^1((34[0-8])|(8\d{2})|(([0-35-9]|4|66|7|9)\d{1}))\d{7}$/i,
          msg: "手机号码格式错误"
        }
      }
    },
    role: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '密码必须存在'
        },
        notEmpty: {
          msg: '密码不能为空'
        },
        set(value) {
          let validate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/
          if (validate) {
            this.setDataValue('password', bcrypt.hashSync(value, 10))
          } else {
            throw  new Error('密码必须包含至少一个大写字母、一个小写字母、一个数字，可以包含特殊字符')
          }
        }
      }
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户名必须存在'
        },
        notEmpty: {
          msg: '用户名不能为空'
        },
        len: {
          args: [4, 12],
          msg: '用户名需要在4 ~ 12个字符之间'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    openId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING
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
          args: [[0, 1]],
          msg: "只能为0，1"  // 0启用 1禁用
        }
      }
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};