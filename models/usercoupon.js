'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.userCoupon.belongsTo(models.coupon, {foreignKey: 'couponId', as: 'couponInfo'});
      models.userCoupon.belongsTo(models.user, {foreignKey: 'userId', as: 'couponUserInfo'});
    }
  }
  userCoupon.init({
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    couponId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'userCoupon',
  });
  return userCoupon;
};