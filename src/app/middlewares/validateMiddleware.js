const joi = require('joi')

const schemas = {
    authSignUpSchema: joi.object({
        firstname: joi.string().min(2).required(),
        surname: joi.string().min(2).required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        role: joi.string().valid('viewer', 'editor', 'admin').required()
    }),
    authSignInSchema: joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    })
}

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)
        if (validatorResult.error) {
            res.status(400).json(validatorResult.error)
        } else {
            req.body = validatorResult.value
            next()
        }
    }
}

module.exports = {
    validateBody,
    schemas
}