const dashboardRouter = require('./dashboard.router')
const authRouter = require('./auth.router')
const manageRouter = require('./manage.router')


function route(app) {

    app.use('/', dashboardRouter)
    
    app.use('/auth', authRouter)

    app.use('/manage', manageRouter)

}

module.exports = route