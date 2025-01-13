const Joi = require('joi');

const validateUser = Joi.object({
    fullname: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

module.exports = { validateUser };