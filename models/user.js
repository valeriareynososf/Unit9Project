'use strict';
const {
    Model
} = require('sequelize');

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // // User.associate = (models) => {
        //     User.hasMany(models.Course, { foreignKey: 'userId' });
        // //   }
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
        allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "first name"',
        }
      },
    },
    lastName: { 
      type: DataTypes.STRING,
     allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "last name"',
        }
      },
    },
    emailAddress: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "This email address already exists."
        },
        validate: {
          notEmpty: {
            msg: 'Please provide a value for "email address"',
          },
          isEmail: {
            msg: 'Please provide a valid mail address',
          },
        },
      },
    password: { 
        type: DataTypes.STRING,
        allowNull: false,
        set (val) {
            const hashPassword = bcrypt.hashSync(val, 10);
            this.setDataValue('password', hashPassword)
        },
        validate: {
          notEmpty: {
            msg: 'Please provide a value for "password"',
          }
        },
      },
  }, {
    sequelize,
    modelName: 'User',
  });
    User.associate = (models) => {
        User.hasMany(models.Course, { foreignKey: 'userId' });
    }

  return User;
};