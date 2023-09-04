const mongoose = require('mongoose')
const { Schema } = mongoose

const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    firstname: {
        type: String,
    },
    surname: {
        type: String,
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook']
    },
    authGoogleId: {
        type: String,
        default: null
    },
    authFacebookId: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['viewer', 'editor', 'admin']
    }
})

userSchema.pre('save', async function (next) {
    try {
        if (this.authType !== 'local') {
            next()
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function (inputPassword) {
    try {
        const result = await bcrypt.compare(inputPassword, this.password)
        return result
    } catch (error) {
        throw new Error(error)
    }
}


module.exports = mongoose.model('user', userSchema)