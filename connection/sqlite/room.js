const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('room', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      type: type.STRING,
      description: type.STRING,
      image: type.STRING,
      quantity: {
        type: type.NUMBER,
        validate: {
          isInt: true,
          notEmpty: true,
          min: 0
        },
        defaultValue: 0
      },
      price: {
        type: type.NUMBER,
        validate: {
          isFloat: true,
          notEmpty: true,
          min: 0
        },
        defaultValue: 0
      },
      isActive: {
        type: type.BOOLEAN,
        defaultValue: true
      },
      isDelete: {
        type: type.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'room'
    })
}