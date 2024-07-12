const Joi = require('joi');

const validateSignUp = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

module.exports = validateSignUp;