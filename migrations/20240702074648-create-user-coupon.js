'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userCoupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      couponId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          notNull: {
            msg: '状态必须存在'
          },
          notEmpty: {
            msg: '态不能为空。'
          },
          isIn: {
            args: [[0, 1, 2]],
            msg: "只能为0，1，2"
          }
        }
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userCoupons');
  }
};