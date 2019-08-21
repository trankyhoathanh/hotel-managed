let express = require('express')
let { Room, Op } = require('../../connection/sequelize')
let roomService = require('../../service/roomService')
let _ = require('lodash');

let router = express.Router()
let routes = function () {

    /////////////////////////////////
    // API to list all the available rooms for any particular day in the future
    // Input : localhost:30004/room?date=2019-08-21
    // Output: data (list rooms available)
    router.route('/')
    .get(async (req, res) => {
        let rooms = null

        let roomChoosedId = await roomService.roomBookedByDate(req.query.date)

        if (req.query.id)
        {
            rooms = await Room.findAll(
                {
                    where: {
                        id: req.query.id,
                        isActive: true,
                        isDelete: false
                    }
                }
            )
        } else {
            rooms = await Room.findAll(
                {
                    where: {
                        id: {
                            [Op.notIn]: roomChoosedId
                        },
                        isActive: true,
                        isDelete: false
                    }
                }
            )
        }


        return res.status(200).json({
            data: rooms,
            statusCode: 200,
            message: 'Get Succeed'
        });
    });

    router.route('/')
    .post(async (req, res) => {
        let room = await Room.create(req.body)

        return res.status(200).json({
            data: room,
            statusCode: 200,
            message: 'Created'
        });
    });

    return router;
};
module.exports = routes;