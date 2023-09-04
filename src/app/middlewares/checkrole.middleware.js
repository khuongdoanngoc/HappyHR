const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { createClient } = require('redis')

const redisClient = createClient()
const DEFAULT_EXPIRATION = 3600

const roles = {
    admin: ['adminPermission', 'hrPermission', 'empPermission'],
    editor: ['hrPermission', 'empPermission'],
    viewer: ['empPermission']
}

redisClient.on('error', err => console.log('redis error: ', err))
redisClient.connect()


function checkRole(method) {
    return async function (req, res, next) {
        const tokenFromRedis = await redisClient.get('token')
        if (tokenFromRedis != null) {
            // console.log('CACHE HIT')
            jwt.verify(JSON.parse(tokenFromRedis), process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).redirect('/auth/page-signin');
                } else {
                    req.user = decoded
                    const userRole = decoded.sub.role
                    if (roles[userRole].includes(method)) {
                        next()
                    } else {
                        req.flash('error', 'Permission Denied!')
                        res.redirect('/manage')
                    }
                }
            })
        } else {
            // console.log('CACHE MISS')
            const token = req.cookies.token
            redisClient.setEx('token', DEFAULT_EXPIRATION, JSON.stringify(token))
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).redirect('/auth/page-signin');
                } else {
                    req.user = decoded
                    const userRole = decoded.sub.role
                    if (roles[userRole].includes(method)) {
                        next()
                    } else {
                        req.flash('error', 'Permission Denied!')
                        res.redirect('/manage')
                    }
                }
            })
        }
    }
}

module.exports = checkRole