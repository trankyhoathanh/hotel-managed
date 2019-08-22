const Sequelize = require('sequelize')
const CustomerModel = require('./sqlite/customer')
const RoomModel = require('./sqlite/room')
const OrderModel = require('./sqlite/order')
const OrderDetailModel = require('./sqlite/order_detail')

const ManagerModel = require('./sqlite/manager')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    transactionType: 'IMMEDIATE',
    logging: false
});
const Op = Sequelize.Op

// Customer
const Customer = CustomerModel(sequelize, Sequelize)
const Room = RoomModel(sequelize, Sequelize)
const Order = OrderModel(sequelize, Sequelize)
const OrderDetail = OrderDetailModel(sequelize, Sequelize)

Customer.hasMany(Order);
Order.belongsTo(Customer);

Order.hasMany(OrderDetail);
OrderDetail.belongsTo(Order);

Room.hasMany(OrderDetail);
OrderDetail.belongsTo(Room);


// Admin
const Manager = ManagerModel(sequelize, Sequelize)


sequelize.sync({ force: false })
.then(() => {
    console.log(`Database & tables OK`)
})

module.exports = {
    sequelize,
    Customer,
    Room,
    Order,
    OrderDetail,
    Manager,
    Op
}