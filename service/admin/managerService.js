let md5 = require('md5');
let { Manager, Op } = require('../../connection/sequelize')
let jwtService = require('../../service/general/jwtService')

///////////////////////////
//  Get all Manager
async function read() {
    let manager = await Manager.findAll()
    return {
        data: manager,
        statusCode: 200,
        message: 'List manager'
    }
}

async function create(data) {
    data.pass = md5(data.pass)

    let manager = await Manager.create(data)
    return {
        data: manager,
        statusCode: 200,
        message: 'Create succeed'
    }
}

async function update(data) {
    
    let manager = await Manager.update(
        data,
        {
            where: { id: data.id } 
        }
    )

    if (!manager)
    {
        return {
            data: null,
            statusCode: 100,
            message: 'Update failed'
        }
    } else {
        return {
            data: manager,
            statusCode: 200,
            message: 'Update succeed'
        }
    }
}

async function del(data) {
    let manager = await Manager.update(
        {
            isActive: false,
            isDelete: true
        },
        {
            where: { id: data.id } 
        }
    )

    if (!manager)
    {
        return {
            data: null,
            statusCode: 100,
            message: 'Delete failed'
        }
    } else {
        return {
            data: manager,
            statusCode: 200,
            message: 'Delete succeed'
        }
    }
}


// Login
async function login(data) {
    let manager = await Manager.findOne({
        where: {
            user: data.user,
            pass: md5(data.pass)
        }
    })

    if (manager) {
        let userToken = {
            id: manager.id,
            userType: 'admin'
        }

        return {
            data: {
                token: await jwtService.jwtSignin(userToken)
            },
            statusCode: 200,
            message: 'Login succeed'
        }
        
    } else {
        return {
            data: null,
            statusCode: 100,
            message: 'Invalid user / pass'
        }
    }
}

async function validateToken(req, res, next) {
    try {
        let checkToken = await jwtService.jwtSignin(req.headers['authorization'])

        if (!checkToken)
        {
            return res.status(200).json({
                data: req.headers['authorization'],
                statusCode: 100,
                message: 'Authorization Invalid'
            })
        }

        let user = await jwtService.jwtDecode(req.headers['authorization'])

            if (!user)
            {
                return res.status(200).json({
                    data: req.headers['authorization'],
                    statusCode: 100,
                    message: 'Authorization Invalid'
                })
            }

            if (user.payload.data 
                && user.payload.data.userType
                && user.payload.data.userType === 'admin')
                {
                    next()
                } else {
                    return res.status(200).json({
                        data: null,
                        statusCode: 100,
                        message: 'Authorization user have not is a Admin'
                    })
                }
    } catch {
        return res.status(200).json({
            data: req.headers['authorization'],
            statusCode: 100,
            message: 'Authorization Invalid'
        })
    }
}

module.exports = {
    read, create, update, del,
    login, validateToken
}