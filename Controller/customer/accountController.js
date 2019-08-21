let express = require('express')
let { Customer } = require('../../connection/sequelize')
let _ = require('lodash');

let router = express.Router()
let routes = function () {

    router.route('/')
    .get(async (req, res) => {
        let customers = null

        if (req.query.id)
        {
            customers = await Customer.findAll(
                {
                    where: {
                        id: req.query.id
                    }
                }
            )
        } else {
            customers = await Customer.findAll()
        }

        return res.status(200).json({
            data: customers,
            statusCode: 200,
            message: 'Get Succeed'
        });
    });

    router.route('/')
    .post(async (req, res) => {
        let customers = await Customer.create(req.body).catch(err => {return err})

        if (customers.dataValues)
        {
            return res.status(200).json({
                data: customers,
                statusCode: 200,
                message: 'Created'
            });
        } else {
            return res.status(200).json({
                data: customers,
                statusCode: 100,
                message: 'Error'
            });
        }
        
    });

    return router;
};
module.exports = routes;