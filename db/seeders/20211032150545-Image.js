'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'images', 
      [
        {
          title       : 'AI is useless',
          path        : "/images/ai.jpeg",
          userId      : 1,
          description : null,
          categoryId  : 4,
          createdAt   : new Date(),
          updatedAt   : new Date()
        },
        {
          title       : "Agile development",
          path        : "/images/agile.png",
          userId      : 1,
          description : null,
          categoryId  : 4,
          createdAt   : new Date(),
          updatedAt   : new Date()
        },
        {
          title       : "Ne pas argumenter",
          path        : "/images/argumenter.jpeg",
          userId      : 1,
          description : null,
          categoryId  : 5,
          createdAt   : new Date(),
          updatedAt   : new Date()
        },
        {
          title       : "TCP vs UDP",
          path        : "/images/tcp_udp.jpeg",
          userId      : 1,
          description : null,
          categoryId  : 4,
          createdAt   : new Date(),
          updatedAt   : new Date()
        },
        {
          title       : "Stackoverflow",
          path        : "/images/stackoverflow.png",
          userId      : 1,
          description : null,
          categoryId  : 4,
          createdAt   : new Date(),
          updatedAt   : new Date()
        },
      ], 
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('images', null, {});
  }
};
