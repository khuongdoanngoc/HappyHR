const authRouter = require('./auth')
const manageRouter = require('./manage')


function route(app) {
    
    app.use('/auth', authRouter)
    
    app.use('/manage', manageRouter)

}

module.exports = route