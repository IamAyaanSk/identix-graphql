import { UserRegisterInput, UserRequestPasswordResetInput } from 'generated/resolvers-types';
import Joi from 'joi';

const JOIcreateUserSchema = Joi.object<UserRegisterInput>({
  username: Joi.string().required().max(20).messages({
    'string.base': 'Username should be a string',
    'string.empty': 'Username is required',
    'string.max': 'No more than 20 characters allowed in username',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email is not valid',
    }),
  password: Joi.string().required().messages({
    'string.base': 'Password should be a string',
    'string.empty': 'Password is required',
  }),
  firstName: Joi.string().max(10).alphanum().messages({
    'string.base': 'First name should be a string',
    'string.max': 'No more than 10 characters allowed in firstname',
    'string.alphanum': 'No special characters allowed in firstname',
  }),
  lastName: Joi.string().max(10).alphanum().messages({
    'string.base': 'Last name should be a string',
    'string.max': 'No more than 10 characters allowed in lastname',
    'string.alphanum': 'No special characters allowed in lastname',
  }),
});

const JOIrequestPasswordResetSchema = Joi.object<UserRequestPasswordResetInput>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email is not valid',
    }),
});

export { JOIcreateUserSchema, JOIrequestPasswordResetSchema };
