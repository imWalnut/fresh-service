'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('authorities', {
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
      images: {
        allowNull: false,
        type: Sequelize.JSON
      },
      shopName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
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
    await queryInterface.addIndex(
        'authorities', {
          fields: ['userId'],  // 要索引的字段
          unique: true,        // 唯一索引
        });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('authorities');
  }
};