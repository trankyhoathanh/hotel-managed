const express = require('express');
const app = express();
const port = process.env.port || 30004;
const server = require("http").Server(app);
const bodyParser = require('body-parser');

// Structure CORS
const cors = require('cors');
app.use(cors());
app.options('*', cors());

// Structure config system
app.use(function (req, res, next) {
    res.setHeader('X-Powered-By', 'TRAN KY HOA THANH Hotel booking V2');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


////////////////////////////////////////
//  Include Services
//  START
let managerService = require('./service/admin/managerService')
let accountService = require('./service/customer/accountService')
//
//  END
//  Include Services
////////////////////////////////////////




////////////////////////////////////////
//  Structure CONTROLLERS for ADMIN
//  START
let adminRoomController = require('./Controller/admin/roomController')();
app.use("/admin/room", adminRoomController);

let adminManagerController = require('./Controller/admin/managerController')();
app.use("/admin/manager", managerService.validateToken, adminManagerController);
//
//  END
//  Structure CONTROLLERS for ADMIN
////////////////////////////////////////



////////////////////////////////////////
//  Structure CONTROLLERS for CUSTOMER
//  START
//
let customerAccountController = require('./Controller/customer/accountController')();
app.use("/customer/account", customerAccountController);

let customerRoomController = require('./Controller/customer/roomController')();
app.use("/customer/room", accountService.validateToken, customerRoomController);

let customerBookingController = require('./Controller/customer/bookingController')();
app.use("/customer/booking", accountService.validateToken, customerBookingController);
//
//  END
//  Structure CONTROLLERS for CUSTOMER
////////////////////////////////////////



// Run system
server.listen(port, function() {
  let datetime = new Date();
  let message = "Server runnning on Port:- " + port + "\r\nStarted at :- " + datetime;
  console.log(message);
})
