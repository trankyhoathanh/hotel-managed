const express = require('express')
const managerService = prodServiceLocator.get('managerService')


let router = express.Router()
let routes = function () {

    /////////////////////////////////////
    //
    //  CRUD Administrator Account
    //
    /////////////////////////////////////


    router.route('/')
    .get(async (req, res) => {
        let manager = await managerService.read()
        return res.status(200).json(manager)
    })

    router.route('/')
    .post(async (req, res) => {
        let manager = await managerService.create(req.body)
        return res.status(200).json(manager)
    })

    router.route('/')
    .put(async (req, res) => {
        let manager = await managerService.update(req.body)
        return res.status(200).json(manager)
    })

    router.route('/')
    .delete(async (req, res) => {
        let manager = await managerService.del(req.body)
        return res.status(200).json(manager)
    })

    return router
}
module.exports = routes;