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
      models.userCoupon.belongsTo(models.user, {foreignKey: 'userId', as: 'couponUserInfo'});
    }
  }
  userCoupon.init({
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    endDate: DataTypes.DATE,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    condition: {
      type: DataTypes.INTEGER
    },
    remark: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'userCoupon',
  });
  return userCoupon;
};