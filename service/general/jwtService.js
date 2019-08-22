const fs = require('fs')
const path = require('path');
const jwt = require('jsonwebtoken')
let privateKEY = fs.readFileSync(path.resolve('config/private.key'))
let publicKEY  = fs.readFileSync(path.resolve('config/public.key'))

const   i = 'Hotel Booking V2',
        s = 'trankyhoathanh.1992@gmail.com',
        a = 'https://trankyhoathanh.com',
        options = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: '3h',
            algorithm: 'RS256'
        }

// ====================   JWT Signin  =====================
async function jwtSignin(data) {
    var payload = {
        data: data
    }

    return jwt.sign(payload, privateKEY, options)
}

// ====================   JWT Verify ======================
async function jwtVerify(token) {
    try {
        let data = await jwt.verify(token, publicKEY, options)
        return {
            data: data,
            status: true
        }
    } catch (err) {
        return {
            data: err,
            status: false
        }
    }
}

// ====================   JWT DeCode ======================
async function jwtDecode(token) {
    return jwt.decode(token, {complete: true});
}

// ====================   Get UserId ======================
async function getUserId(token) {
    let decoded = await jwtDecode(token)
    let userId = ''
    if (decoded && decoded.payload && decoded.payload.data && decoded.payload.data.id)
    {
        userId = decoded.payload.data.id
    }
    
    return userId
}

module.exports = {
    getUserId,
    jwtSignin,
    jwtVerify,
    jwtDecode
}