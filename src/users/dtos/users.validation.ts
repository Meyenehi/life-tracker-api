const Joi = require('@hapi/joi');

export const createUserValidator = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  firstName: Joi.string()
    .alphanum()
    .min(2)
    .max(30)
    .required(),
  lastName: Joi.string()
    .alphanum()
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .required(),
});
