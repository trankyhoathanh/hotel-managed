const Sequelize = require('sequelize')
module.exports = (sequelize, type) => {
    return sequelize.define('customer', {
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
    },
    {
      tableName: 'customer'
    })
}