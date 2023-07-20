const express = require('express')
const router = express.Router()

const authController = require('../app/controllers/AuthControllers')

const { validateBody, schemas } = require('../app/middlewares/validateMiddleware')
const passport = require('passport')
require('../app/middlewares/passportMiddleware')

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

router.get('/secret', passport.authenticate('jwt', { failureRedirect: 'page-signin', failureFlash: true }), authController.secret)

module.exports = router 