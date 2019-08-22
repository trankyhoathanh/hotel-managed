let express = require('express')
let { Room, Op } = require('../../connection/sequelize')
let roomService = require('../../service/customer/roomService')
let _ = require('lodash');

let router = express.Router()
let routes = function () {

    router.route('/')
    .get(async (req, res) => {
        let rooms = await Room.findAll()

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

    router.route('/')
    .put(async (req, res) => {
        let room = await Room.update(
            req.body,
            {
                where: { id: req.body.id } 
            }
        )
    
        if (!room)
        {
            return res.status(200).json({
                data: null,
                statusCode: 100,
                message: 'Update failed'
            });
        } else {
            return res.status(200).json({
                data: room,
                statusCode: 200,
                message: 'Update succeed'
            });
        }
    });

    router.route('/')
    .delete(async (req, res) => {
        let room = await Room.update(
            {
                isActive: false,
                isDelete: true
            },
            {
                where: { id: req.body.id } 
            }
        )
    
        if (!room)
        {
            return res.status(200).json({
                data: null,
                statusCode: 100,
                message: 'Delete failed'
            });
        } else {
            return res.status(200).json({
                data: room,
                statusCode: 200,
                message: 'Delete succeed'
            });
        }
       
        // let room = await Room.destroy(
        //     {
        //         where: { id: req.body.id }
        //     }
        // )

        // return res.status(200).json({
        //     data: room,
        //     statusCode: 200,
        //     message: 'Deleted'
        // });
    });

    return router;
};
module.exports = routes;