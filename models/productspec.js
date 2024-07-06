'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class productSpec extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.productSpec.belongsTo(models.product, {foreignKey: 'productId', as: 'productSpecList'});
            models.productSpec.hasMany(models.cart, {foreignKey: 'productSpecId', as: 'productSpecInfo'});
        }
    }

    productSpec.init({
        productId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '商品必须存在'
                },
                notEmpty: {
                    msg: '商品不能为空'
                }
            }
        },
        specName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '规格名称必须存在'
                },
                notEmpty: {
                    msg: '规格名称不能为空'
                },
                len: {
                    args: [1, 10],
                    msg: '规格名称长度需要在1 ~ 10个字符之间。'
                }
            }
        },
        specRemark: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
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
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '商品价格必须存在'
                },
                notEmpty: {
                    msg: '商品价格不能为空'
                }
            }
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'productSpec',
    });
    return productSpec;
};