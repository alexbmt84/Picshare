'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Animaux',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fail',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Actus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Geek',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Drôle',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Artistique',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
