const Sequelize = require('sequelize')
module.exports = (sequelize, type) => {
    return sequelize.define('manager', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      user: {
        type: type.STRING,
        validate: {
          notEmpty: true
        },
        defaultValue: '',
        unique: true
      },
      pass: {
        type: type.STRING,
        validate: {
          notEmpty: true
        },
        defaultValue: ''
      },
      canDelete: {
        type: type.BOOLEAN,
        defaultValue: true
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
      tableName: 'manager'
    })
}