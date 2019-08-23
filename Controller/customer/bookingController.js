const express = require('express')
const bookingService = require('../../service/customer/bookingService')
const jwtService = require('../../service/general/jwtService')

const expressQueue = require('express-queue')
const queueMw = expressQueue({ activeLimit: 20, queuedLimit: 20 });

let router = express.Router()
let routes = function () {

    router.route('/')
    .get(async (req, res) => {
        // Get UserId from token
        let userId = await jwtService.getUserId(req.headers['authorization'])
        let body = req.body
        body.customerId = userId

        let order = await bookingService.getAllBooking(body)
        return res.status(200).json(order)
    })

    /////////////////////////////////
    // API to list all the available rooms for any particular day in the future
    // Input : localhost:30004/booking
    //  {"roomIds":[{"id":"cf93aad7-cbe6-4b18-b6e2-5fdd67d9fde9","date":"2019-08-21"},{"id":"eba69930-919e-42e1-b927-5fc80dbe9f8f","date":"2019-08-22"}],"customerId":"d3bb9541-c859-40ba-ba97-3d2e0e08c215"}
    router.route('/')
    .post(
    queueMw,
    async (req, res) => {

        // Get UserId from token
        let userId = await jwtService.getUserId(req.headers['authorization'])
        let body = req.body
        body.customerId = userId

        let booking = await bookingService.bookRoom(body)
        return res.status(200).json(booking)
    })

    router.route('/')
    .put(async (req, res) => {

        // Get UserId from token
        let userId = await jwtService.getUserId(req.headers['authorization'])
        let body = req.body
        body.customerId = userId

        let booking = await bookingService.updateBookRoom(body)
        return res.status(200).json(booking)
    })

    /////////////////////////////////
    // API to cancel any booking
    // Input : localhost:30004/booking/cancel
    // { "id": "dbc8d12d-bf84-4de8-a277-f4bd07ac87bf" }
    router.route('/cancel')
    .post(async (req, res) => {
        // Get UserId from token
        let userId = await jwtService.getUserId(req.headers['authorization'])
        let body = req.body
        body.customerId = userId
        
        let cancel = await bookingService.cancel(req.body)
        return res.status(200).json(cancel)
    })

    return router
}
module.exports = routes;