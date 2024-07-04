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
      // define association here
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
    status: DataTypes.INTEGER,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'userCoupon',
  });
  return userCoupon;
};