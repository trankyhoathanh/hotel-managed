const express = require('express')
const customerService = require('../../service/customer/accountService')
const { check, validationResult } = require('express-validator')

let router = express.Router()
let routes = function () {
    
    router.route('/register')
    .post(
    [
        check('user', `Username is not valid`).not().isEmpty(),
        check('pass', `Password is not valid`).not().isEmpty()
    ],
    async (req, res) => {
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
        
        let customer = await customerService.create(req.body)
        return res.status(200).json(customer)
    })

    router.route('/login')
    .post(
    [
        check('user', `Username is not valid`).not().isEmpty(),
        check('pass', `Password is not valid`).not().isEmpty()
    ],
    async (req, res) => {
        
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
        
        // Executer
        let customer = await customerService.login(req.body)
        return res.status(200).json(customer)
    })

    return router
}
module.exports = routes