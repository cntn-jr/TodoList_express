'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('Todos', [
      {
        id: 1,
        title: 'test title 1',
        memo: 'test memo 1',
        user_id: 1,
        priority: 'high',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        title: 'test title 2',
        user_id: 1,
        priority: 'middle',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        title: 'test title 3',
        memo: 'test memo 3',
        user_id: 2,
        priority: 'low',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        title: 'test title 4',
        user_id: 3,
        priority: 'high',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        title: 'test title 5',
        memo: 'test memo 5',
        user_id: 3,
        priority: 'middle',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      },
    ])
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
