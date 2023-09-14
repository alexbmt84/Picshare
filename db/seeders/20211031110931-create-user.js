'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
        username: 'Laurie',
        email: "laurie@gmail.com",
        password: "EQgS9n+h4fARf289cCQcGkKnsHcRqTwkd8xRbZBC+ds=", // for password "coucou"
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'Alex',
        email: "alexisdev@gmail.com",
        password: "EQgS9n+h4fARf289cCQcGkKnsHcRqTwkd8xRbZBC+ds=", // for password "coucou"
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        username: 'Gaetan',
        email: "gaetandev@gmail.com",
        password: "EQgS9n+h4fARf289cCQcGkKnsHcRqTwkd8xRbZBC+ds=", // for password "coucou"
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        username: 'Marie-Charlotte',
        email: "mcdev@gmail.com",
        password: "EQgS9n+h4fARf289cCQcGkKnsHcRqTwkd8xRbZBC+ds=", // for password "coucou"
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
