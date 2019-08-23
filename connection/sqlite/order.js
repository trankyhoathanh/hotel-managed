const Sequelize = require('sequelize')
module.exports = (sequelize, type) => {
    return sequelize.define('order', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      startDate: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
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
      tableName: 'order'
    })
}