const express = require('express')
const roomService = prodServiceLocator.get('roomService')

const { check, validationResult } = require('express-validator')

let router = express.Router()
let routes = function () {

    /////////////////////////////////
    // API to list all the available rooms for any particular day in the future
    // Input : localhost:30004/customer/room/unauthen?date=2019-08-21
    // localhost:30004/customer/room/unauthen?dateFrom=2019-08-21&dateTo=2019-08-22
    // Output: data (list rooms available)
    router.route('/')
    .get(
    [
        check('dateFrom', `Date From is not null`).not().isEmpty()
    ],async (req, res) => {
        // validate model
        let errors = await validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(200).json(
                { 
                    data: {
                        err: errors.array()
                    },
                    statusCode: 100,
                    message: 'Validate input'
                }
            )
        }

        let rooms = await roomService.roomsAvailable(req.query)

        return res.status(200).json({
            data: rooms,
            statusCode: 200,
            message: 'Get Succeed'
        })
    })

    return router
}
module.exports = routes;