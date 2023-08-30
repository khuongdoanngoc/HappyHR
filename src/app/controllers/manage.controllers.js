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

        const username = { firstname: req.user.sub.firstname, surname: req.user.sub.surname }

        await Promise.all([employeeQuery, Employee.countDocumentsDeleted()])
            .then(([employees, countDeleted]) => {
                res.render('management/manage', {
                    countDeleted,
                    employees: mutipleMongooseToObject(employees),
                    username,
                    error: req.flash('error')
                })
            })
            .catch(next)
    }

    // [POST] /postcreateemployee
    async postCreateEmployee(req, res, next) {
        const employee = new Employee(req.body)
        await employee.save()
            .then(newEmployee => {
                const idNewEmployee = newEmployee._id
                res.redirect(`/manage/${idNewEmployee}/edit`)
            })
            .catch(error => { res.json(error) })
    }

    // [GET] /:id/edit
    async editEmployee(req, res, next) {

        const username = { firstname: req.user.sub.firstname, surname: req.user.sub.surname }
        await Employee.findById(req.params.id)
            .then(employee => {
                res.render('management/edit', {
                    employee: mongooseToObject(employee),
                    username
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

        const username = { firstname: req.user.sub.firstname, surname: req.user.sub.surname }
        await employeeQuery
            .then(employees => {
                employees = employees.map(employees => employees.toObject())
                res.render('management/trash', { employees, username })
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