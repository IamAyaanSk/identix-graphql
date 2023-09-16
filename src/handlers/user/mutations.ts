import gql from 'graphql-tag';

import bcrypt from 'bcrypt';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { errorMap } from '../../constants/errorMap.js';
import { createUserSchema } from '../../JOI/userJOISchemas.js';

const mutations: MutationResolvers = {
  register: async (_, { email, password, username, firstName, lastName }, { prisma }) => {
    try {
      await createUserSchema.validateAsync({ username, password, email, firstName, lastName });

      // Check if user already exists
      const findUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      // If user exists return user already exists error
      if (findUser) {
        return {
          status: ReturnStatus.Error,
          error: errorMap['user/alreadyExists'],
        };
      }

      // Create a hashed password if new user
      const hashedPwd = await bcrypt.hash(password, 12);

      // Save user to database
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPwd,
          username,
          firstName,
          lastName,
        },
      });

      // If user not saved return fail to create error
      if (!user) {
        return {
          status: ReturnStatus.Error,
          error: errorMap['user/failCreate'],
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
        error: errorMap['user/failCreate'],
      };
    }
  },

  deleteUser: async (_, {}, { prisma, userId }) => {
    // Check if user is authenticated
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['auth/unauthenticated'],
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
        error: errorMap['user/failDelete'],
      };
    }

    // Return success message
    return {
      status: ReturnStatus.Success,
      data: 'User deleted successsfully',
    };
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    register(
      email: String!
      password: String!
      username: String
      firstName: String
      lastName: String
    ): StatusDataErrorString!
    deleteUser: StatusDataErrorString!
  }
`;

export { mutations, mutationTypeDefs };
