'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productSpecs', {
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
      status: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT.UNSIGNED
      },
      remark: {
        type: Sequelize.STRING
      },
      specId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      specAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
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
    await queryInterface.dropTable('productSpecs');
  }
};