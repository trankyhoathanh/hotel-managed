let md5 = require('md5')
const { Customer } = prodServiceLocator.get('dataProduction')
const jwtService = prodServiceLocator.get('jwtService')

async function read() {
    let customer = await Customer.findAll()
    return {
        data: customer,
        statusCode: 200,
        message: 'List customer'
    }
}

async function create(data) {
    data.pass = md5(data.pass)

    let customer = await Customer.create(data)
    return {
        data: customer,
        statusCode: 200,
        message: 'Create succeed'
    }
}

async function update(data) {
    
    let customer = await Customer.update(
        data,
        {
            where: { id: data.id } 
        }
    )

    if (!customer)
    {
        return {
            data: null,
            statusCode: 100,
            message: 'Update failed'
        }
    } else {
        return {
            data: customer,
            statusCode: 200,
            message: 'Update succeed'
        }
    }
}

async function del(data) {
    let customer = await Customer.update(
        {
            isActive: false,
            isDelete: true
        },
        {
            where: { id: data.id } 
        }
    )

    if (!customer)
    {
        return {
            data: null,
            statusCode: 100,
            message: 'Delete failed'
        }
    } else {
        return {
            data: customer,
            statusCode: 200,
            message: 'Delete succeed'
        }
    }
}

// Login
async function login(data) {
    let customer = await Customer.findOne({
        where: {
            user: data.user,
            pass: md5(data.pass)
        }
    })

    if (customer) {
        let userToken = {
            id: customer.id,
            userType: 'customer'
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
        let checkToken = await jwtService.jwtVerify(req.headers['authorization'])

        if (!checkToken || 
            (
                checkToken
                && checkToken.status === false
            ))
        {
            return res.status(200).json({
                data: checkToken,
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
                && user.payload.data.userType === 'customer')
                {
                    next()
                } else {
                    return res.status(200).json({
                        data: null,
                        statusCode: 100,
                        message: 'Authorization user have not is a Customer'
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