'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.product.hasMany(models.productSpec, {foreignKey: 'productId'});
      models.product.hasMany(models.productGroup, {foreignKey: 'productId'});
      models.product.belongsTo(models.category, {foreignKey: 'categoryId'});
    }
  }
  product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品名称必须存在'
        },
        notEmpty: {
          msg: '商品名称不能为空'
        },
        len: {
          args: [1, 50],
          msg: '商品名称长度需要在1 ~ 50个字符之间'
        }
      }
    },
    subImages: {
      type: DataTypes.JSON
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品主图必须存在'
        },
        notEmpty: {
          msg: '商品主图不能为空'
        },
        isUrl: {
          msg: "图片地址格式错误"
        }
      }
    },
    productCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品编码必须存在'
        },
        notEmpty: {
          msg: '商品编码不能为空'
        },
        len: {
          args: [8, 20],
          msg: '商品编码长度需要在8 ~ 20个字符之间'
        }
      }
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品分类必须存在'
        },
        notEmpty: {
          msg: '商品分类不能为空'
        }
      }
    },
    stockAlarmAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品预警数量必须存在'
        },
        notEmpty: {
          msg: '商品预警数量不能为空'
        }
      }
    },
    stockAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '库存数量必须存在'
        },
        notEmpty: {
          msg: '库存数量不能为空'
        }
      }
    },
    soldAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: {
          msg: '已售数量必须存在'
        },
        notEmpty: {
          msg: '已售数量不能为空'
        }
      }
    },
    deposit: {
      type: DataTypes.DECIMAL(10, 2)
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
          args: [[0, 1, 2, 3]],
          msg: "只能为0，1，2，3"
        }
      }
    },
    remark: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};