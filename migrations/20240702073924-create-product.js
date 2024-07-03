'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subImages: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mainImage: {
        type: Sequelize.STRING(1000),
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
      stockAlarmAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
        allowNull: false
      },
      stockAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      soldAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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