import gql from 'graphql-tag';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { QueryResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { JWT_SECRET_KEY } from '../../constants/global.js';
import { internalErrorMap } from '../../constants/errorMaps/internalErrorMap.js';

const queries: QueryResolvers = {
  login: async (_, { details }, { prisma }) => {
    // Check if user exists
    const findUser = await prisma.user.findFirst({
      where: {
        email: details.email,
      },
    });

    // If user doesn't exist return user not found error
    if (!findUser) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/notAuthorize'],
      };
    }

    // Check password if user Exists
    const pwdCheck = await bcrypt.compare(details.password, findUser.password);

    // If password not matched return error
    if (!pwdCheck) {
      return {
        status: ReturnStatus.Error,
        data: internalErrorMap['user/notAuthorize'],
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
    login(details: UserLoginInput!): StatusDataErrorString!
  }
`;

export { queries, queryTypeDefs };
