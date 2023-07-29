const express = require('express')
const router = express.Router()

const dashboardControllers = require('../app/controllers/dashboard.controllers')
const checkroleMiddleware = require('../app/middlewares/checkrole.middleware')

router.get('/', checkroleMiddleware('read'), dashboardControllers.home)


module.exports = router