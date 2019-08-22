let express = require('express')
let customerService = require('../../service/customer/accountService')

let router = express.Router()
let routes = function () {
    
    router.route('/login')
    .post(async (req, res) => {
        let customer = await customerService.login(req.body)
        return res.status(200).json(customer);
    });

    return router;
};
module.exports = routes;