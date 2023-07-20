const { mutipleMongooseToObject, mongooseToObject } = require('../../util/mongoose')
const Employee = require('../models/employee')
const User = require('../models/user')

class ManageControllers {

    //[GET] /manage
    async listEmployees(req, res, next) {

        // res.json(res.locals._sort)
        let employeeQuery = Employee.find({})

        if (req.query.hasOwnProperty('_sort')) {
            employeeQuery = employeeQuery.sort({
                [req.query.column]: req.query.type
            })
        }


        await Promise.all([employeeQuery, Employee.countDocumentsDeleted()])
            .then(([employees, countDeleted]) => {
                const userId = req.session.passport.user.userId
                const user = User.findById(userId)
                res.render('admin/manage', {
                    countDeleted,
                    employees: mutipleMongooseToObject(employees),
                    error: req.flash('error')
                })
            })
            .catch(next)
    }

    // [GET] /create
    async createEmployee(req, res, next) {
        await res.render('admin/create')
    }

    // [POST] /store
    async postCreateEmployee(req, res, next) {
        const employee = new Employee(req.body)
        await employee.save()
            .then(() => res.redirect('/manage'))
            .catch(error => { })
    }

    // [GET] /:id/edit
    async editEmployee(req, res, next) {

        await Employee.findById(req.params.id)
            .then(employee => {
                res.render('admin/edit', {
                    employee: mongooseToObject(employee)
                })
            })
    }

    // [PUT] /:id/update
    async updateEmployee(req, res, next) {
        await Employee.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/manage')
            })
            .catch(next)
        // res.json(req.body)
    }

    // [DELETE] /:id/delete
    async destroyEmployee(req, res, next) {
        await Employee.delete({ _id: req.params.id })
            .then(() => {
                res.redirect('back')
            })
            .catch(next)
    }

    // [GET] /trash
    async trashEmployees(req, res, next) {

        let employeeQuery = Employee.findDeleted({})

        if (req.query.hasOwnProperty('_sort')) {
            employeeQuery = employeeQuery.sort({
                [req.query.column]: req.query.type
            })
        }

        await employeeQuery
            .then(employees => {
                employees = employees.map(employees => employees.toObject())
                res.render('admin/trash', { employees })
                // res.json(employees)
            })
            .catch(error => next(error))
    }

    // [PATCH] /:id/restore
    async restoreEmployee(req, res, next) {
        await Employee.restore({ _id: req.params.id })
            .then(() => {
                res.redirect('/manage')
            })
            .catch(next)
    }

    // [DELETE] /:id/forceDelete
    async forceDeleteEmployee(req, res, next) {
        await Employee.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect('back')
            })
            .catch(next)

        // res.send(req.params.id)
    }

    // [POST] /handleFormActions
    async handleFormActions(req, res, next) {

        switch (req.body.action) {
            case 'delete':
                {
                    await Employee.delete({ _id: { $in: req.body.employeeIds } })
                        .then(() => {
                            res.redirect('back')
                        })
                        .catch(next)
                    break
                }
            case 'restore':
                {
                    await Employee.restore({ _id: { $in: req.body.employeeIds } })
                        .then(() => {
                            res.redirect('back')
                        })
                        .catch(next)
                    break
                }
            case 'forceDelete':
                {
                    await Employee.deleteOne({ _id: { $in: req.body.employeeIds } })
                        .then(() => {
                            res.redirect('back')
                        })
                        .catch(next)
                    break
                }
            default:
                {
                    await res.json({ message: 'Error!' })
                    break
                }
        }

    }

}

module.exports = new ManageControllers()