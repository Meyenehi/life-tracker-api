const Joi = require('@hapi/joi');

export const CreateSkillValidator = Joi.object().keys({
  name: Joi.string()
    .min(2)
    .max(30)
    .required(),
});

export const CreateSkillsValidator = Joi.object().keys({
  skills: Joi.array().items(CreateSkillValidator),
});

export const UpdateSkillValidator = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string()
    .min(2)
    .max(30),
});
