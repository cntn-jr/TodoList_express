'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('Users', [
      {
        name: 'test1',
        password: bcrypt.hashSync('password', bcrypt.genSaltSync(8)),
        age: 20,
        email: 'test1@example.com',
        createdAt: now, updatedAt: now
      },
      {
        name: 'test2',
        password: bcrypt.hashSync('password', bcrypt.genSaltSync(8)),
        age: 38,
        email: 'test2@example.com',
        createdAt: now, updatedAt: now
      },
      {
        name: 'test3',
        password: bcrypt.hashSync('password', bcrypt.genSaltSync(8)),
        age: 15,
        email: 'test3@example.com',
        createdAt: now, updatedAt: now
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
