const Joi = require('@hapi/joi');

export const createUserSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }),
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
  password: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  ),
});
