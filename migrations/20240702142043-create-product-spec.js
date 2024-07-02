'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productSpecs', {
      productSpecId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      productId: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: false
      },
      specAmount: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      price: {
        type: Sequelize.TINYINT.UNSIGNED,
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