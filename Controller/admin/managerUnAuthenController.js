let express = require('express')
let managerService = require('../../service/admin/managerService')

let router = express.Router()
let routes = function () {

    router.route('/login')
    .post(async (req, res) => {
        let manager = await managerService.login(req.body)
        return res.status(200).json(manager);
    });

    return router;
};
module.exports = routes;