const session = require('express-session')

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false
})

module.exports = sessionMiddleware