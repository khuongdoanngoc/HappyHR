const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    userName : { type: String },
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('message', messageSchema)