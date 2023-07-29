const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../models/user')

// passport-jwt config
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
}
passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await User.findOne({ _id: jwtPayload.sub })
        if (!user) {
            return done(null, null, { message: 'Sorry! Sign in failure' })
        }
        done(null, user)
    } catch (error) {
        done(error, null)
    }
}))

// passport-local config
const localOptions = {
    usernameField: 'email'
}
passport.use(new LocalStrategy(localOptions, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email })
        const message = 'Wrong email or password!'
        if (!user) {
            return done(null, false, message)
        }
        const isCorrectPassword = await user.isValidPassword(password)
        if (!isCorrectPassword) {
            return done(null, false, message)
        }
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

passport.serializeUser((userModel, done) => {
    // Lưu thông tin người dùng vào session
    const user = {
        userId: userModel._id,
        role: userModel.role,
    }
    done(null, user);
});

passport.deserializeUser((id, done) => {
    // Truy xuất thông tin người dùng từ session
    // Và trả về đối tượng người dùng
    const user = User.findById(id);
    done(null, user);
});