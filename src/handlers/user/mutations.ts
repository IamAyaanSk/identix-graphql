import gql from 'graphql-tag';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { internalErrorMap } from '../../constants/errorMaps/internalErrorMap.js';
import { JOIcreateUserSchema, JOIrequestPasswordResetSchema } from '../../joi/userJOISchemas.js';
import { checkPasswordResetSecret, getPasswordResetSecret } from '../../utils/getPasswordResetSecret.js';
import { getDecodedJWT } from '../../utils/getDecodedJWT.js';
import { IS_TESTING, JWT_SECRET_KEY, SES_SENDERS_EMAIL_ADDRESS } from '../../constants/global.js';
import { SES_CLIENT } from '../../constants/sesClient.js';
import { SendTemplatedEmailRequest } from '@aws-sdk/client-ses';
import { internalSuccessMap } from '../../constants/errorMaps/internalSuccessMap.js';

const mutations: MutationResolvers = {
  register: async (_, { details }, { prisma }) => {
    try {
      await JOIcreateUserSchema.validateAsync(details);

      // Check if user already exists
      const findUser = await prisma.user.findFirst({
        where: {
          email: details.email,
          isDeleted: false,
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
          error: internalErrorMap['user/failRegister'],
        };
      }

      if (IS_TESTING && details.username?.endsWith('-delete')) {
        await prisma.user.delete({
          where: {
            email: details.email,
          },
        });
      }

      // Return Success message if user registered
      return {
        status: ReturnStatus.Success,
        data: internalSuccessMap['user/successRegister'],
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
        error: internalErrorMap['server/failComplete'],
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
    const deleteLinks = prisma.userLink.updateMany({
      where: {
        userId,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });

    const deleteUser = prisma.user.update({
      where: {
        id: userId,
        isDeleted: false,
      },

      data: {
        isDeleted: true,
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
      data: internalSuccessMap['user/successDelete'],
    };
  },

  requestPasswordReset: async (_, { details }, { prisma }) => {
    try {
      await JOIrequestPasswordResetSchema.validateAsync(details);

      // Search user with email in db
      const foundUser = await prisma.user.findFirst({
        where: {
          email: details.email,
          isDeleted: false,
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
      const passwordResetSecret = await getPasswordResetSecret(foundUser);

      const resetToken = jwt.sign({ id: foundUser.id, email: foundUser.email, passwordResetSecret }, JWT_SECRET_KEY, {
        expiresIn: '1h',
      });

      // // Send email to user
      const UserResetEmailParams: SendTemplatedEmailRequest = {
        Source: SES_SENDERS_EMAIL_ADDRESS,
        Destination: {
          ToAddresses: [foundUser.email],
        },
        Template: 'ResetPasswordTemplate',
        TemplateData: JSON.stringify({ username: foundUser.username, token: resetToken }),
      };

      const sent = SES_CLIENT.sendTemplatedEmail(UserResetEmailParams);

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
        data: internalSuccessMap['user/successPasswordResetRequest'],
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
    const decodedJWT = getDecodedJWT(details.token, JWT_SECRET_KEY) || null;

    // If not verified return error
    if (!decodedJWT) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failPasswordReset'],
      };
    }

    // Search user with email in db
    const foundUser = await prisma.user.findFirst({
      where: {
        id: decodedJWT.id,
      },
    });

    // If user not found return error
    if (!foundUser) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/notFound'],
      };
    }

    const isValidToken = await checkPasswordResetSecret(foundUser, decodedJWT.passwordResetSecret || '');

    if (!isValidToken) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failPasswordReset'],
      };
    }

    const isOldPassowrd = await bcrypt.compare(details.password, foundUser.password);

    if (isOldPassowrd) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/samePassword'],
      };
    }

    // If verified, hash the passsword and store new password in database
    const newPassword = await bcrypt.hash(details.password, 12);

    const updatePassword = await prisma.user.update({
      where: {
        id: decodedJWT.id,
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
      data: internalSuccessMap['user/successPasswordReset'],
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
