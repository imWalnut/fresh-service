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
    userCouponId: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    couponId: {
      type: DataTypes.STRING,
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