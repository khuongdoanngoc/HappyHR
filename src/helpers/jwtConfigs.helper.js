const jwt = require('jsonwebtoken')

const encodedToken = (tokenInfo) => {
    return jwt.sign({
        iss: 'Khang Nguyen Thuc',
        sub: tokenInfo
    }, process.env.JWT_SECRET_KEY)
}

module.exports = encodedToken