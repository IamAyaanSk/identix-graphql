import { UserLinkCreateInput, UserLinkUpdateInput } from 'generated/resolvers-types';
import Joi from 'joi';

const commonUserLinkSchemaItems = {
  firstName: Joi.string().min(3).max(20).message('Please enter a valid fisrt name'),
  lastName: Joi.string().max(10).message('Please enter a valid last name'),
  email: Joi.string().email().message('Please enter a valid email'),

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
  lastName: commonUserLinkSchemaItems.firstName.required(),
  email: commonUserLinkSchemaItems.firstName.required(),
});

const JOIUpdateUserLinkSchema = Joi.object<UserLinkUpdateInput>({
  ...commonUserLinkSchemaItems,
});

export { JOIcreateUserLinkSchema, JOIUpdateUserLinkSchema };
