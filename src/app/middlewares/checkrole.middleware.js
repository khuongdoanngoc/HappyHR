const User = require('../models/user')
const jwt = require('jsonwebtoken')

const roles = {
    admin: ['read', 'createEmp', 'update', 'delete', 'restore', 'forceDelete'],
    editor: ['read', 'createEmp', 'update', 'restore', 'delete'],
    viewer: ['read']
}

function checkRole(method) {
    return function (req, res, next) {
        const token = req.cookies.token
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

module.exports = checkRole