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
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '入力項目が正しくありません'
        },
        len: {
          args: [0,30],
          msg: '文字数は、３０文字以内です'
        }
      }
    },
    memo: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0,100],
          msg: '文字数は、１００文字以内です'
        }

      }
    },
    user_id: DataTypes.INTEGER,
    priority: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true,
      }
    },
    doneTodo: {
      type: DataTypes.BOOLEAN,
    }
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};