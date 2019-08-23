const express = require('express')
const app = express()
const port = process.env.port || 30004
const server = require("http").Server(app)
const bodyParser = require('body-parser')

// Structure CORS
const cors = require('cors')
app.use(cors())
app.options('*', cors())

// Structure config system
app.use(function (req, res, next) {
    res.setHeader('X-Powered-By', 'TRAN KY HOA THANH Hotel booking V2')
    next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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
let adminUnAuthenController = require('./Controller/admin/managerUnAuthenController')()
app.use("/admin/manager/unauthen", adminUnAuthenController)

let adminManagerController = require('./Controller/admin/managerController')()
app.use("/admin/manager", managerService.validateToken, adminManagerController)

let adminRoomController = require('./Controller/admin/roomController')()
app.use("/admin/room", managerService.validateToken, adminRoomController)
//
//  END
//  Structure CONTROLLERS for ADMIN
////////////////////////////////////////



////////////////////////////////////////
//  Structure CONTROLLERS for CUSTOMER
//  START
//

// Turn off customer, just apply for create CUSTOMER TEST
let customerAccountUnAuthenController = require('./Controller/customer/accountUnAuthenController')()
app.use("/customer/account/unauthen", customerAccountUnAuthenController)

let customerRoomUnAuthenController = require('./Controller/customer/roomUnAuthenController')()
app.use("/customer/room/unauthen", customerRoomUnAuthenController)

let customerRoomController = require('./Controller/customer/roomController')()
app.use("/customer/room", accountService.validateToken, customerRoomController)

let customerBookingController = require('./Controller/customer/bookingController')()
app.use("/customer/booking", accountService.validateToken, customerBookingController)
//
//  END
//  Structure CONTROLLERS for CUSTOMER
////////////////////////////////////////




// Run system
server.listen(port, function() {
  console.log(`Server runnning on Port : ${port} \r\nStarted at : ${new Date()}`
  )
})
