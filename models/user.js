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
      models.user.hasMany(models.userCoupon, {foreignKey: 'userId', as: 'couponUserInfo'});
      models.user.hasMany(models.order, {foreignKey: 'userId', as: 'orderUserInfo'});
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
          args: [2, 10],
          msg: '姓名长度需要在2 ~ 10个字符之间'
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
    provinceCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '省份编码必须存在'
        },
        notEmpty: {
          msg: '省份编码不能为空'
        }
      }
    },
    provinceName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '省份名称必须存在'
        },
        notEmpty: {
          msg: '省份名称不能为空'
        }
      }
    },
    cityCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '城市编码必须存在'
        },
        notEmpty: {
          msg: '城市编码不能为空'
        }
      }
    },
    cityName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '城市名称必须存在'
        },
        notEmpty: {
          msg: '城市名称不能为空'
        }
      }
    },
    countyCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '县/区编码必须存在'
        },
        notEmpty: {
          msg: '县/区编码不能为空'
        }
      }
    },
    countyName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '县/区名称必须存在'
        },
        notEmpty: {
          msg: '县/区名称不能为空'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '地址必须存在'
        },
        notEmpty: {
          msg: '地址不能为空'
        },
        len: {
          args: [2, 50],
          msg: '地址长度需要在2 ~ 50个字符之间'
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
    images: {
      type: DataTypes.JSON
    },
    shopName: {
      type: DataTypes.STRING
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