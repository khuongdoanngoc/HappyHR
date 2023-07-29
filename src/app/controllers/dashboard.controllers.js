const User = require('../models/user')

class DashboardController {
    // [GET] /
    async home(req, res, next) {
        const username = { firstname: req.user.sub.firstname, surname: req.user.sub.surname }
        await res.render('dashboard/dashboard', { username })
    }
}

module.exports = new DashboardController()