import gql from 'graphql-tag';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { QueryResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { JWT_SECRET_KEY } from '../../constants/global.js';
import { errorMap } from '../../constants/errorMap.js';

const queries: QueryResolvers = {
  login: async (_, { email, password }, { prisma }) => {
    // Check if user exists
    const findUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    // If user doesn't exist return user not found error
    if (!findUser) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['user/notAuthorize'],
      };
    }

    // Check password if user Exists
    const pwdCheck = await bcrypt.compare(password, findUser.password);

    // If password not matched return error
    if (!pwdCheck) {
      return {
        status: ReturnStatus.Error,
        data: errorMap['user/notAuthorize'],
      };
    }

    // Create jwt token if user verified
    const token = jwt.sign({ id: findUser.id }, JWT_SECRET_KEY, { expiresIn: '10m' });

    // Return success message
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
