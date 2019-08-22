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

let winston = require('winston');
let optionsWinston = {
    errorFile: {
        level: 'error',
        filename: `${__dirname}/winston_error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    file: {
      level: 'info',
      filename: `${__dirname}/winston_info.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  }
let logger = new winston.createLogger({
    transports: [
        new (winston.transports.Console)(optionsWinston.console),
        new (winston.transports.File)(optionsWinston.errorFile),
        new (winston.transports.File)(optionsWinston.file)
        // new winston.transports.File(optionsWinston.file),
        // new winston.transports.Console(optionsWinston.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
})

// logger.stream = {
//     write: function(message, encoding) {
//       logger.info(message);
//     },
// }

module.exports = {
    sequelize,
    Customer,
    Room,
    Order,
    OrderDetail,
    Manager,
    Op,
    logger
}