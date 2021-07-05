'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Todos', 'dueDate', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
    });
  },

  down: async (queryInterface, Sequelize) => {
  }
};
