const User = require('../models/user')

const roles = {
    admin: ['read', 'createEmp', 'update', 'delete', 'restore', 'forceDelete'],
    editor: ['read', 'createEmp', 'update', 'restore', 'delete'],
    viewer: ['read']
}

function checkRole(role) {
    return function (req, res, next) {
        const session = req.session
        if (!req.session.passport) {
            res.redirect('/auth/page-signin')
        } else {
            const userRole = session.passport.user.role
            if (roles[userRole].includes(role)) {
                next()
            } else {
                req.flash('error', 'Permission Denied!')
                res.redirect('/manage')
            }
        }

    }
}

module.exports = checkRole