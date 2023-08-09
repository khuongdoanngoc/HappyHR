const express = require('express')
const router = express.Router()

const manageControllers = require('../app/controllers/manage.controllers')
const checkRole = require('../app/middlewares/checkrole.middleware')

router.get('/', checkRole('empPermission'), manageControllers.listEmployees)
router.get('/create', checkRole('hrPermission'), manageControllers.createEmployee)
router.post('/postCreateEmp', checkRole('hrPermission'), manageControllers.postCreateEmployee)
router.post('/handleFormActions', checkRole('hrPermission'), manageControllers.handleFormActions)
router.get('/:id/edit', checkRole('hrPermission'), manageControllers.editEmployee)
router.put('/:id/update', checkRole('hrPermission'), manageControllers.updateEmployee)
router.patch('/:id/restore', checkRole('hrPermission'), manageControllers.restoreEmployee)
router.delete('/:id/delete', checkRole('hrPermission'), manageControllers.destroyEmployee)
router.delete('/:id/forceDelete', checkRole('adminPermission'), manageControllers.forceDeleteEmployee)
router.get('/trash', checkRole('empPermission'), manageControllers.trashEmployees)

module.exports = router