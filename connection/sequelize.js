const Sequelize = require('sequelize')
const CustomerModel = require('./sqlite/customer')
const RoomModel = require('./sqlite/room')
const OrderModel = require('./sqlite/order')
const OrderDetailModel = require('./sqlite/order_detail')

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

const Customer = CustomerModel(sequelize, Sequelize)
const Room = RoomModel(sequelize, Sequelize)
const Order = OrderModel(sequelize, Sequelize)
const OrderDetail = OrderDetailModel(sequelize, Sequelize)

const Op = Sequelize.Op

Customer.hasMany(Order);
Order.belongsTo(Customer);

Order.hasMany(OrderDetail);
OrderDetail.belongsTo(Order);

Room.hasMany(OrderDetail);
OrderDetail.belongsTo(Room);

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
    Op
}