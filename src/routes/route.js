const authRouter = require('./auth.router')
const manageRouter = require('./manage.router')


function route(app) {
    
    app.use('/auth', authRouter)
    
    app.use('/manage', manageRouter)

}

module.exports = route