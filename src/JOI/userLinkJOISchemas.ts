import { UserLinkCreateInput, UserLinkUpdateInput } from 'generated/resolvers-types';
import Joi from 'joi';

const commonUserLinkSchemaItems = {
  firstName: Joi.string().min(1).max(10).alphanum().messages({
    'string.base': 'First name should be a string',
    'string.empty': 'Firstname is required',
    'string.max': 'Firstname must have atmost 10 character',
    'string.min': 'Firstname must have atleat 1 character',
    'string.alphanum': 'No special characters allowed in firstname',
  }),

  lastName: Joi.string().max(10).alphanum().messages({
    'string.base': 'Last name should be a string',
    'string.empty': 'Lastname is required',
    'string.max': 'Lastname must have atmost 10 character',
    'string.min': 'Lastname must have atleat 1 character',
    'string.alphanum': 'No special characters allowed in lastname',
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email is not valid',
    }),

  facebookURL: Joi.string()
    .pattern(/^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_.-]{1,30}$/, 'Facebook URL')
    .message('Please enter valid facebook URL'),

  instagramURL: Joi.string()
    .pattern(/^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.-]{1,30}$/, 'Instagram URL')
    .message('Please enter valid instagram URL'),

  twitterURL: Joi.string()
    .pattern(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_.-]{1,20}$/, 'Twitter URL')
    .message('Please enter valid twitter/x URL'),

  linkedInURL: Joi.string()
    .pattern(/^https:\/\/(www\.)?linkedin\.com\/[a-zA-Z]{2}\/[a-zA-Z0-9_.-]{1,30}$/, 'LinkedIn URL')
    .message('Please enter valid linkedin URL'),

  websiteURL: Joi.string()
    .pattern(/^https?:\/\/[\w\-.]+(\.[a-z]{2,63}){1,2}\/?.*$/, 'Website URL')
    .message('Please enter valid website URL'),

  phoneURL: Joi.string()
    .pattern(/^tel:[+]?\d{1,15}$/, 'Phone Number')
    .message('Please enter a 10 digit phone number'),
};

const JOIcreateUserLinkSchema = Joi.object<UserLinkCreateInput>({
  ...commonUserLinkSchemaItems,
  firstName: commonUserLinkSchemaItems.firstName.required(),
  lastName: commonUserLinkSchemaItems.lastName.required(),
  email: commonUserLinkSchemaItems.email.required(),
});

const JOIUpdateUserLinkSchema = Joi.object<UserLinkUpdateInput>({
  ...commonUserLinkSchemaItems,
});

export { JOIcreateUserLinkSchema, JOIUpdateUserLinkSchema };
