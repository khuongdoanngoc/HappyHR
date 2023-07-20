const express = require('express')
const router = express.Router()

const manageControllers = require('../app/controllers/ManageControllers')

const checkRole = require('../app/middlewares/checkRoleMiddleware')

router.get('/', checkRole('read'), manageControllers.listEmployees)
router.get('/create', checkRole('createEmp'), manageControllers.createEmployee)
router.post('/postCreateEmp', checkRole('createEmp'), manageControllers.postCreateEmployee)
router.post('/handleFormActions', checkRole('delete'), manageControllers.handleFormActions)
router.get('/:id/edit', checkRole('update'), manageControllers.editEmployee)
router.put('/:id/update', checkRole('update'), manageControllers.updateEmployee)
router.patch('/:id/restore', checkRole('restore'), manageControllers.restoreEmployee)
router.delete('/:id/delete', checkRole('delete'), manageControllers.destroyEmployee)
router.delete('/:id/forceDelete', checkRole('forceDelete'), manageControllers.forceDeleteEmployee)
router.get('/trash', checkRole('read'), manageControllers.trashEmployees)

module.exports = router