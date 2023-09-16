import Joi from 'joi';

const createUserSchema = Joi.object({
  username: Joi.string().required().max(20).message('Only 20 characters allowed in username'),
  email: Joi.string().email().required().message('Email is not valid'),
  password: Joi.string().required(),
  firstName: Joi.string().alphanum().max(10).message('No special characters allowed in firstname'),
  lastName: Joi.string().alphanum().length(10).message('No special characters allowed in firstname'),
});

export { createUserSchema };
