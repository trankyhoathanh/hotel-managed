const express = require('express')
const roomService = prodServiceLocator.get('roomService')

let router = express.Router()
let routes = function () {

    router.route('/')
    .get(async (req, res) => {
        let room = await roomService.read()
        return res.status(200).json(room)
    })

    router.route('/')
    .post(async (req, res) => {
        let room = await roomService.create(req.body)
        return res.status(200).json(room)
    })

    router.route('/')
    .put(async (req, res) => {
        let room = await roomService.update(req.body)
        return res.status(200).json(room)
    })

    router.route('/')
    .delete(async (req, res) => {
        let room = await roomService.del(req.body)
        return res.status(200).json(room)
    })

    return router
}
module.exports = routes