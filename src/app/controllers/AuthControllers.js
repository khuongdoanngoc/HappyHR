const User = require('../models/user')
const jwt = require('jsonwebtoken')


const encodedToken = (userId) => {
    return jwt.sign({
        iss: 'Khang Nguyen Thuc',
        sub: userId,
    }, process.env.JWT_SECRET_KEY)
}

class AuthController
{

    // [GET] /auth/page-signup
    async pageSignup (req, res, next) {
        await res.render('auth/pageSignup')
    }

    // [POST] /auth/signUp
    async signUp(req, res, next) {
        const newUser = new User(req.body)
        newUser.authType = 'local'
        await newUser.save()
                .then((newUserValue) => {
                    const token = encodedToken(newUserValue._id)
                    res.setHeader('Authorization', token)
                    res.redirect('/auth/page-signin')
                })
                .catch(next)
    }

    // [GET] /auth/page-signin
    async pageSignin(req, res, next) {
        await res.render('auth/pageSignin', { error: req.flash('error')})
    }

    // [POST] /auth/signin
    async signIn(req, res, next) {
        await res.setHeader('Authorization', 'khangdepgai')
        await res.redirect('/manage')
    }

    // [GET] /auth/secret
    async secret(req, res, next) {
        await res.json({ message: 'OK!' })
    }
}

module.exports = new AuthController()