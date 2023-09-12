import gql from 'graphql-tag';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { QueryResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { JWT_SECRET_KEY } from '../../constants/global.js';

const queries: QueryResolvers = {
  login: async (_, { email, password }, { prisma }) => {
    // Check if user exists:
    const findUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // If User not exist return Error
    if (!findUser) {
      return {
        status: ReturnStatus.Error,
        error: `User is not registered`,
      };
    }

    // User exists...
    // Check password
    const pwdCheck = await bcrypt.compare(password, findUser.password);

    // Incorrect pwd return error
    if (!pwdCheck) {
      return {
        status: ReturnStatus.Error,
        data: `Invalid Password`,
      };
    }

    // Pwd matched generate jwt
    const token = jwt.sign({ id: findUser.id }, JWT_SECRET_KEY, { expiresIn: '10m' });

    return {
      status: ReturnStatus.Success,
      data: token,
    };
  },
};

const queryTypeDefs = gql`
  extend type Query {
    login(email: String!, password: String!): StatusDataErrorString!
  }
`;

export { queries, queryTypeDefs };
