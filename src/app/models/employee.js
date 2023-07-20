const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const mongooseDelete = require('mongoose-delete')
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.set('strictQuery', false)

const Schema = mongoose.Schema

const Employee = new Schema({
    _id: { type: Number },
    name: { type: String },
    identityCard: { type: String },
    birth: { type: String },
    salary: { type: Number }
}, {
    _id: false,
    timestamps: true
})

mongoose.plugin(slug)

Employee.plugin(AutoIncrement);
Employee.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
})

module.exports = mongoose.model('employee', Employee)