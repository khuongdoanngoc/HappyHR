const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const GoogleStrategy = require('passport-google-oauth2').Strategy

const FacebookStrategy = require('passport-facebook').Strategy

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

// passport google token config
const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_URL_CALLBACK,
    passReqToCallback: true
}
passport.use(new GoogleStrategy(googleOptions, async function (request, accessToken, refreshToken, profile, done) {
    try {
        // if user already have in database
        const isExistUser = await User.findOne({ authGoogleId: profile.id, authType: 'google' })
        if (isExistUser) {
            return done(null, isExistUser)
        }
        const newUser = new User({
            authGoogleId: profile.id,
            authType: 'google',
            email: profile.email,
            firstname: profile.family_name,
            surname: profile.given_name,
            role: 'editor'
        })
        await newUser.save()
        done(null, newUser)
    } catch (error) {
        console.log('error: ', error)
        return done(error, null)
    }
}))

const facebookOptions = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_URL_CALLBACK,
    profileFields: ['id', 'displayName', 'email']
}
passport.use(new FacebookStrategy(facebookOptions, async function (accessToken, refreshToken, profile, cb) {
    try {
        const isExistUser = await User.findOne({ authFacebookId: profile.id, authType: 'facebook' })
        if (isExistUser) {
            return cb(null, isExistUser)
        }
        const newUser = new User({
            email: `${profile.id}@gmail.com`,
            authFacebookId: profile.id,
            surname: profile.displayName,
            authType: 'facebook',
            role: 'editor'
        })
        await newUser.save()
        cb(null, newUser)
    } catch (error) {
        cb(error, null)
    }
}))

// session
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