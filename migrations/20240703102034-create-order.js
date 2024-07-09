'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      orderNo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      userCouponId: {
        type: Sequelize.BIGINT
      },
      paymentType: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      payment: {
        type: Sequelize.DECIMAL(10, 2)
      },
      postage: {
        type: Sequelize.DECIMAL(10, 2)
      },
      sendTime: {
        type: Sequelize.DATE
      },
      closeTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      cancelTime: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.TINYINT.UNSIGNED
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
    await queryInterface.dropTable('orders');
  }
};