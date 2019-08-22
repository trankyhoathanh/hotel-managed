let express = require('express')
let { Room, Op } = require('../../connection/sequelize')
let roomService = require('../../service/customer/roomService')
let _ = require('lodash');

let router = express.Router()
let routes = function () {

    /////////////////////////////////
    // API to list all the available rooms for any particular day in the future
    // Input : localhost:30004/customer/room/unauthen?date=2019-08-21
    // localhost:30004/customer/room/unauthen?dateFrom=2019-08-21&dateTo=2019-08-22
    // Output: data (list rooms available)
    router.route('/')
    .get(async (req, res) => {
        let rooms = await roomService.roomsAvailable(req.query)

        return res.status(200).json({
            data: rooms,
            statusCode: 200,
            message: 'Get Succeed'
        });
    });

    return router;
};
module.exports = routes;