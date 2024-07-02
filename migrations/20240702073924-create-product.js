'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      productId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      images: {
        type: Sequelize.STRING,
        allowNull: true
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      groupId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productSpecId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stockAlarmAmount: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      stockAmount: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      soldAmount: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT.UNSIGNED
      },
      remark: {
        type: Sequelize.TEXT
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
        'products', {
          fields: ['name'],  // 要索引的字段
          unique: true        // 唯一索引
        });
    await queryInterface.addIndex(
        'products', {
          fields: ['productCode'],  // 要索引的字段
          unique: true        // 唯一索引
        });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};