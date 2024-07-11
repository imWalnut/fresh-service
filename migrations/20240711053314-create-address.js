'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      userId: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        allowNull: false,
        type: Sequelize.TINYINT.UNSIGNED
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      provinceCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      provinceName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cityCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cityName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      countyCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      countyName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lat: {
        allowNull: false,
        type: Sequelize.DECIMAL(8, 6),
      },
      lon: {
        allowNull: false,
        type: Sequelize.DECIMAL(9, 6),
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
    await queryInterface.dropTable('addresses');
  }
};