'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.orderProduct.belongsTo(models.order, {foreignKey: 'orderId', as: 'orderProductList'});
    }
  }
  orderProduct.init({
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品id必须存在'
        },
        notEmpty: {
          msg: '商品id不能为空'
        }
      }
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品名称必须存在'
        },
        notEmpty: {
          msg: '商品名称不能为空'
        }
      }
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品图片必须存在'
        },
        notEmpty: {
          msg: '商品图片不能为空'
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
        }
      }
    },
    specName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品规格名称必须存在'
        },
        notEmpty: {
          msg: '商品规格名称不能为空'
        }
      }
    },
    specNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品规格数量必须存在'
        },
        notEmpty: {
          msg: '商品规格数量不能为空'
        }
      }
    },
    specPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: '商品规格价格必须存在'
        },
        notEmpty: {
          msg: '商品规格价格不能为空'
        }
      }
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '订单id必须存在'
        },
        notEmpty: {
          msg: '订单id不能为空'
        }
      }
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: '总价必须存在'
        },
        notEmpty: {
          msg: '总价不能为空'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '数量必须存在'
        },
        notEmpty: {
          msg: '数量不能为空'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'orderProduct',
  });
  return orderProduct;
};