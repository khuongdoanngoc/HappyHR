const jwt = require('jsonwebtoken')

const encodedToken = (userId, role) => {
    return jwt.sign({
        iss: 'Khang Nguyen Thuc',
        sub: userId,
        role: role,
    }, process.env.JWT_SECRET_KEY)
}

module.exports = encodedToken