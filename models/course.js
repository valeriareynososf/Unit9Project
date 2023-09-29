'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // Course.associate = (models) => {
            Course.belongsTo(models.User, { foreignKey: 'userId' });
         // }
    }
  }
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "first name"',
        }
      },
    },
    description: { 
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "last name"',
        }
      },
    },
    estimatedTime: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please provide a value for "email address"',
          }
        },
      },
    materialsNeeded: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please provide a value for "password"',
          }
        },
      },
  }, {
    sequelize,
    modelName: 'Course',
  });

//   Course.associate = (models) => {
//     Course.belongsTo(models.User, { foreignKey: 'userId' });
//   }

  return Course;
};