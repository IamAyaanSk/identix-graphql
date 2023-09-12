import gql from 'graphql-tag';

import bcrypt from 'bcrypt';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';

const mutations: MutationResolvers = {
  async register(_, { email, password, userName, firstName, lastName }, { prisma }) {
    // Check if user exists
    const findUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (findUser) {
      return {
        status: ReturnStatus.Error,
        error: `User for already exists`,
      };
    }

    // User doesnt exist:
    // HASH PASSWORD
    const hashedPwd = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPwd,
        username: userName,
        firstName: firstName,
        lastName: lastName,
      },
    });

    return {
      status: ReturnStatus.Success,
      data: JSON.stringify(user),
    };
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    register(
      email: String!
      password: String!
      userName: String
      firstName: String
      lastName: String
    ): StatusDataErrorString!
  }
`;

export { mutations, mutationTypeDefs };
