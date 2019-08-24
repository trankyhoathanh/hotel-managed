const express = require('express')
const managerService = prodServiceLocator.get('managerService')

const { check, validationResult } = require('express-validator')

let router = express.Router()
let routes = function () {

    // Init Account Manager (this is PRIVATE)
    router.route('/createprivate')
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

        let manager = await managerService.create(req.body)
        return res.status(200).json(manager)
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
        
        let manager = await managerService.login(req.body)
        return res.status(200).json(manager)
    })

    return router
}
module.exports = routes;