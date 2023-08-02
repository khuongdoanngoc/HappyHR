const express = require('express')
const router = express.Router()

const authControllers = require('../app/controllers/auth.controllers')

const { validateBody, schemas } = require('../helpers/validates.helper')
const passport = require('passport')
require('../app/middlewares/passport.middleware')

// sign up
router.get('/page-signup', authControllers.pageSignup)
router.post('/signup', validateBody(schemas.authSignUpSchema), authControllers.signUp)

// sign in
router.get('/page-signin', authControllers.pageSignin)
router.post('/signin', passport.authenticate('local', {
    failureRedirect: 'page-signin',
    failureFlash: true,
    session: true
}), validateBody(schemas.authSignInSchema), authControllers.signIn)

// sign out
router.post('/signout', authControllers.signOut)

// signin with google

router.get('/google', passport.authenticate('google', { scope: [ 'email', 'profile']}))
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/page-signin'
}), authControllers.google)

router.get('/secret', passport.authenticate('jwt', { failureRedirect: 'page-signin', failureFlash: true }), authControllers.secret)

module.exports = router 