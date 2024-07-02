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
      // define association here
    }
  }
  user.init({
    userId: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '手机号码必须存在。'
        },
        notEmpty: {
          msg: '手机号码不能为空。'
        },
        is: {
          args: /^1((34[0-8])|(8\d{2})|(([0-35-9]|4|66|7|9)\d{1}))\d{7}$/i,
          msg: "手机号码格式错误"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '邮箱必须存在。'
        },
        notEmpty: {
          msg: '邮箱不能为空。'
        },
        isEmail: {
          msg: '请输入正确的邮箱格式。'
        },
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '姓名必须存在。'
        },
        notEmpty: {
          msg: '姓名不能为空。'
        },
        len: {
          args: [2, 10],
          msg: '姓名长度需要在2 ~ 10个字符之间。'
        }
      }
    },
    sex: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '地址必须存在。'
        },
        notEmpty: {
          msg: '地址不能为空。'
        },
        len: {
          args: [10, 50],
          msg: '地址长度需要在10 ~ 50个字符之间。'
        }
      }
    },
    role: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true
    },
    inviteBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '密码必须存在。'
        },
        notEmpty: {
          msg: '密码不能为空。'
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
          msg: '用户名必须存在。'
        },
        notEmpty: {
          msg: '用户名不能为空。'
        },
        len: {
          args: [4, 12],
          msg: '用户名需要在4 ~ 12个字符之间。'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};