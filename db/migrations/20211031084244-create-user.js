'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        username: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: { notEmpty: true }
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: { isEmail: true }
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING(44)
        },
        avatar: {
          allowNull: true,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, {
        uniqueKeys: {
          Items_unique: {
              fields: ['email']
          }
        }
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};