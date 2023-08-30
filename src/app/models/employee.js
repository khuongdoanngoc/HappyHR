const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const mongooseDelete = require('mongoose-delete')
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.set('strictQuery', false)

const Schema = mongoose.Schema

const Employee = new Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    identityCard: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birth: { type: String },
    gender: {
        type: String,
        enum: ['male', 'female', 'different']
    },
    department: { type: String },
    salary: { type: Number },
    address: { type: String },
}, {
    timestamps: true
})

mongoose.plugin(slug)

Employee.plugin(AutoIncrement);
Employee.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
})

module.exports = mongoose.model('employee', Employee)