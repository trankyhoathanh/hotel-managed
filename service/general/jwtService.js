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
            expiresIn: "12h",
            algorithm: "RS256"
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
        return jwt.verify(token, publicKEY, options)
    } catch (err) {
        return false;
    }
}

// ====================   JWT DeCode ======================
async function jwtDecode(token) {
    return jwt.decode(token, {complete: true});
 }

module.exports = {
    jwtSignin,
    jwtVerify,
    jwtDecode
}