'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.Users, {
        foreignKey: 'user_id'
      })
    }
  };
  Todo.init({
    title: DataTypes.STRING,
    memo: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    priority: DataTypes.STRING,
    dueDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};