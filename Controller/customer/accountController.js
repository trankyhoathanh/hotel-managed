const express = require('express')
const customerService = require('../../service/customer/accountService')

let router = express.Router()
let routes = function () {

    router.route('/')
    .get(async (req, res) => {
        let customer = await customerService.read()
        return res.status(200).json(customer)
    })

    router.route('/')
    .post(async (req, res) => {
        let customer = await customerService.create(req.body)
        return res.status(200).json(customer)
    })

    router.route('/')
    .put(async (req, res) => {
        let customer = await customerService.update(req.body)
        return res.status(200).json(customer)
    })

    router.route('/')
    .delete(async (req, res) => {
        let customer = await customerService.del(req.body)
        return res.status(200).json(customer)
    })

    router.route('/login')
    .post(async (req, res) => {
        let customer = await customerService.login(req.body)
        return res.status(200).json(customer)
    })

    return router
}
module.exports = routes;