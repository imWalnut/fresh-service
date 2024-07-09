'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      productId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productImage: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      productCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      specName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      specNum: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      specPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      orderId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('orderProducts');
  }
};