import gql from 'graphql-tag';

import bcrypt from 'bcrypt';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { errorMap } from '../../constants/errorMap.js';

const mutations: MutationResolvers = {
  async register(_, { email, password, username, firstName, lastName }, { prisma }) {
    const findUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (findUser) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['user/alreadyExists'],
      };
    }

    const hashedPwd = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPwd,
        username,
        firstName,
        lastName,
      },
    });

    if (!user) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['user/failCreate'],
      };
    }

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
