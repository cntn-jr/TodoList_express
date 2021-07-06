'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // define association here
    }
  };
  Users.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '入力項目が正しくありません'
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '入力項目が正しくありません'
        },
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: '入力項目が正しくありません'
        },
        min: {
          args: [0],
          msg: '入力項目が正しくありません'
        },
        max: {
          args: [150],
          msg: '入力項目が正しくありません'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: '入力項目が正しくありません'
        },
        notEmpty: {
          msg: '入力項目が正しくありません'
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};