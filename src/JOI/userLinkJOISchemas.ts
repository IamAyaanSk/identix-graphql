import Joi from 'joi';

const createUserLinkSchema = Joi.object({
  firstName: Joi.string().required().max(10).message('Firstname not valid'),
  lastName: Joi.string().required().max(10).message('Lastname not valid'),
  email: Joi.string().required().email().message('Email not valid'),

  facebookURL: Joi.string()
    .pattern(/^https:\/\/www\.facebook\.com\/[a-zA-Z0-9_.-]+\/?$/, 'Facebook URL')
    .message('Please enter valid facebook URL'),

  instagramURL: Joi.string()
    .pattern(/^https:\/\/www\.instagram\.com\/[a-zA-Z0-9_.-]+\/?$/, 'Instagram URL')
    .message('Please enter valid instagram URL'),

  twitterURL: Joi.string()
    .pattern(/^https:\/\/www\.twitter\.com\/[a-zA-Z0-9_.-]+\/?$/, 'Twitter URL')
    .message('Please enter valid twitter URL'),

  linkedInURL: Joi.string()
    .pattern(/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_.-]+\/?$/, 'LinkedIn URL')
    .message('Please enter valid linkedin URL'),

  websiteURL: Joi.string()
    .pattern(/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Website URL')
    .message('Please enter valid website URL'),

  phoneNUM: Joi.string()
    .pattern(/^\d{10}$/, 'Phone Number')
    .message('Please enter a 10 digit phone number'),
});

const updateUserLink = Joi.object({
  firstName: Joi.string().max(10).message('Firstname not valid'),
  lastName: Joi.string().max(10).message('Lastname not valid'),
  email: Joi.string().email().message('Email not valid'),

  facebookURL: Joi.string()
    .pattern(/^https:\/\/www\.facebook\.com\/[a-zA-Z0-9_.-]+\/?$/, 'Facebook URL')
    .message('Please enter valid facebook URL'),

  instagramURL: Joi.string()
    .pattern(/^https:\/\/www\.instagram\.com\/[a-zA-Z0-9_.-]+\/?$/, 'Instagram URL')
    .message('Please enter valid instagram URL'),

  twitterURL: Joi.string()
    .pattern(/^https:\/\/www\.twitter\.com\/[a-zA-Z0-9_.-]+\/?$/, 'Twitter URL')
    .message('Please enter valid twitter URL'),

  linkedInURL: Joi.string()
    .pattern(/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_.-]+\/?$/, 'LinkedIn URL')
    .message('Please enter valid linkedin URL'),

  websiteURL: Joi.string()
    .pattern(/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Website URL')
    .message('Please enter valid website URL'),

  phoneNUM: Joi.string()
    .pattern(/^\d{10}$/, 'Phone Number')
    .message('Please enter a 10 digit phone number'),
});

export { createUserLinkSchema, updateUserLink };
