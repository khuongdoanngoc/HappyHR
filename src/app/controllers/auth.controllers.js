const User = require('../models/user')
const encodedToken = require('../../helpers/jwtConfigs.helper')

class AuthController {

    // [GET] /auth/page-signup
    async pageSignup(req, res, next) {
        await res.render('auth/pageSignup')
    }

    // [POST] /auth/signUp
    async signUp(req, res, next) {
        const newUser = new User(req.body)
        newUser.authType = 'local'
        await newUser.save()
            .then((newUserValue) => {
                const tokenInfo = {
                    _id: newUserValue._id,
                    role: newUserValue.role,
                    firstname: newUserValue.firstname,
                    surname: newUserValue.surname
                }
                const token = encodedToken(tokenInfo)
                res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
                res.redirect('/')
            })
            .catch(next)
    }

    // [GET] /auth/page-signin
    async pageSignin(req, res, next) {
        await res.render('auth/pageSignin', { error: req.flash('error') })
    }

    // [POST] /auth/signin
    async signIn(req, res, next) {
        await User.findOne({ email: req.body.email })
            .select('_id role firstname surname')
            .exec((err, result) => {
                if (err) {
                    res.status(500).json(err)
                } else if (!result) {
                    res.redirect('/auth/page-signin', { error: req.flash('error') })
                } else {
                    const token = encodedToken(result)
                    res.cookie('token', token, { htppOnly: true, maxAge: 1000 * 60 * 60 })
                    res.redirect('/manage')
                }
            })
    }

    async signOut(req, res, next) {
        await res.clearCookie('token')
        await res.redirect('/auth/page-signin')
    }

    // [POST] /auth/google
    async google(req, res, next) {
        const user = await User.findById(req.session.passport.user.userId)
            .select('_id role firstname surname')
            .exec()
        if (!user) {
            res.redirect('/auth/page-signin', { error: req.flash('error') })
        } else {
            const token = encodedToken(user)
            res.cookie('token', token, { htppOnly: true, maxAge: 1000 * 60 * 60 })
            res.redirect('/manage')
        }
    }

    // [GET] /auth/secret
    async secret(req, res, next) {
        await res.json({ message: 'OK!' })
    }
}

module.exports = new AuthController()