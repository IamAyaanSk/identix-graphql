import gql from 'graphql-tag';

import bcrypt from 'bcrypt';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { errorMap } from '../../constants/errorMap.js';

const mutations: MutationResolvers = {
  async register(_, { email, password, username, firstName, lastName }, { prisma }) {
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

    // If user created return success message
    return {
      status: ReturnStatus.Success,
      data: 'User Created Successfully',
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
  }
`;

export { mutations, mutationTypeDefs };
