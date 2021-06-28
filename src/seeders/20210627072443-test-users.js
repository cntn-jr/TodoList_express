'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('Users', [
      {name: 'test1', password: 'password', age: 20, email: 'test1@example.com', createdAt: now, updatedAt: now},
      {name: 'test2', password: 'password', age: 38, email: 'test2@example.com', createdAt: now, updatedAt: now},
      {name: 'test3', password: 'password', age: 15, email: 'test3@example.com', createdAt: now, updatedAt: now},
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
