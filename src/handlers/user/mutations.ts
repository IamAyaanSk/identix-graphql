import gql from 'graphql-tag';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { internalErrorMap } from '../../constants/internalErrorMap.js';
import { JOIcreateUserSchema, JOIrequestPasswordResetSchema } from '../../joi/userJOISchemas.js';
import { getPasswordResetSecret } from 'utils/getPasswordResetSecret.js';
import { getDecodedJWT } from 'utils/getDecodedJWT.js';
import { SENDERS_EMAIL_ADDRESS } from '../../constants/global.js';

let passwordResetSecret: string;

const mutations: MutationResolvers = {
  register: async (_, { details }, { prisma }) => {
    try {
      await JOIcreateUserSchema.validateAsync(details);

      // Check if user already exists
      const findUser = await prisma.user.findFirst({
        where: {
          email: details.email,
        },
      });

      // If user exists return user already exists error
      if (findUser) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['user/alreadyExists'],
        };
      }

      // Create a hashed password if new user
      const hashedPwd = await bcrypt.hash(details.password, 12);

      // Save user to database
      const user = await prisma.user.create({
        data: {
          email: details.email,
          password: hashedPwd,
          username: details.username,
          firstName: details.firstName,
          lastName: details.lastName,
        },
      });

      // If user not saved return fail to create error
      if (!user) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['user/failCreate'],
        };
      }

      // Return Success message if user registered
      return {
        status: ReturnStatus.Success,
        data: 'User registered successfully',
      };
    } catch (validationError) {
      // Handle validation errors
      if (validationError instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: validationError.message,
        };
      }
      // Handle other errors
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failCreate'],
      };
    }
  },

  deleteUser: async (_, {}, { prisma, userId }) => {
    // Check if user is authenticated
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/unauthenticated'],
      };
    }

    // Delete user and his links
    const deleteLinks = prisma.userLink.deleteMany({
      where: {
        userId,
      },
    });

    const deleteUser = prisma.user.delete({
      where: {
        id: userId,
      },
    });

    const transaction = await prisma.$transaction([deleteLinks, deleteUser]);

    // Check if everything is deleted
    if (!transaction) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failDelete'],
      };
    }

    // Return success message
    return {
      status: ReturnStatus.Success,
      data: 'User deleted successsfully',
    };
  },

  requestPasswordReset: async (_, { details }, { prisma }) => {
    try {
      await JOIrequestPasswordResetSchema.validateAsync(details);

      // Search user with email in db
      const foundUser = await prisma.user.findFirst({
        where: {
          email: details.email,
        },
      });

      // If user not found return error
      if (!foundUser) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['user/notFound'],
        };
      }

      // If user found generate token
      passwordResetSecret = getPasswordResetSecret(foundUser);

      const resetToken = jwt.sign({ userId: foundUser.id, email: foundUser.email }, passwordResetSecret, {
        expiresIn: '1h',
      });

      // Send email to user

      AWS.config.update({ region: 'ap-south-1' });
      const ses = new AWS.SES();

      const UserResetEmailParams = {
        Source: SENDERS_EMAIL_ADDRESS,
        Destination: {
          ToAddresses: [foundUser.email],
        },
        Template: 'ResetPasswordTemplate',
        TemplateData: JSON.stringify({ username: foundUser.username, token: resetToken }),
      };

      const sent = ses.sendTemplatedEmail(UserResetEmailParams);

      // Return error if failed to sent email
      if (sent instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['server/failComplete'],
        };
      }

      // Return success message
      return {
        status: ReturnStatus.Success,
        data: 'Please find password reset instructions on your registered email address',
      };
    } catch (validationError) {
      if (validationError instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: validationError.message,
        };
      }

      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }
  },

  resetPassword: async (_, { details }, { prisma }) => {
    // Verify jwt token with secret
    const decodedJWT = getDecodedJWT(details.token, passwordResetSecret) || null;

    // If not verified return error
    if (!decodedJWT) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failPasswordReset'],
      };
    }

    // If verified, hash the passsword and store new password in database
    const newPassword = await bcrypt.hash(details.password, 12);

    const updatePassword = await prisma.user.update({
      where: {
        email: decodedJWT.email,
      },
      data: {
        password: newPassword,
      },
    });

    // If new password not saved, return error
    if (!updatePassword) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['server/failComplete'],
      };
    }

    // Return success message
    return {
      status: ReturnStatus.Success,
      data: `Password changed successfully`,
    };
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    register(details: UserRegisterInput!): StatusDataErrorString!

    deleteUser: StatusDataErrorString!

    requestPasswordReset(details: UserRequestPasswordResetInput!): StatusDataErrorString!

    resetPassword(details: UserResetPasswordInput!): StatusDataErrorString!
  }
`;

export { mutations, mutationTypeDefs };
