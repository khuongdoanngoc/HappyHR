const express = require('express')
const router = express.Router()

const authController = require('../app/controllers/auth.controllers')

const { validateBody, schemas } = require('../helpers/validates.helper')
const passport = require('passport')
require('../app/middlewares/passport.middleware')

// sign up
router.get('/page-signup', authController.pageSignup)
router.post('/signup', validateBody(schemas.authSignUpSchema), authController.signUp)

// sign in
router.get('/page-signin', authController.pageSignin)
router.post('/signin', passport.authenticate('local', {
    failureRedirect: 'page-signin',
    failureFlash: true,
    session: true
}), validateBody(schemas.authSignInSchema), authController.signIn)

// sign out
router.post('/signout', authController.signOut)

router.get('/secret', passport.authenticate('jwt', { failureRedirect: 'page-signin', failureFlash: true }), authController.secret)

module.exports = router 