'use strict';
const {UnauthorizedError} = require("../utils/errors");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sex: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT.UNSIGNED
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT.UNSIGNED
      },
      inviteBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      images: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      shopName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remark: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        allowNull: false,
        defaultValue: 0,
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
        'users', {
          fields: ['phoneNumber'],  // 要索引的字段
          unique: true,        // 唯一索引
        });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};