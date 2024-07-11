'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.address.belongsTo(models.user, {foreignKey: 'userId'});
    }
  }
  address.init({
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
    lat: {
      allowNull: false,
      type: DataTypes.DECIMAL(8, 6),
      validate: {
        notNull: {
          msg: '纬度必须存在'
        },
        notEmpty: {
          msg: '纬度不能为空'
        }
      }
    },
    lon: {
      allowNull: false,
      type: DataTypes.DECIMAL(9, 6),
      validate: {
        notNull: {
          msg: '经度必须存在'
        },
        notEmpty: {
          msg: '经度不能为空'
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
  }, {
    sequelize,
    modelName: 'address',
  });
  return address;
};