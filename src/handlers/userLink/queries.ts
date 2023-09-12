import gql from 'graphql-tag';
import { QueryResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { dateToEpochTimestamp } from '../../utils/dateToEpochTimestamp.js';
import { errorMap } from '../../constants/errorMap.js';

const queries: QueryResolvers = {
  getUserLinks: async (_, {}, { prisma, userId }) => {
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['auth/unauthenticated'],
      };
    }

    const userLinks = await prisma.userLink.findMany({
      where: {
        userId,
      },
    });

    return {
      status: ReturnStatus.Success,
      data: userLinks.map((userLink) => {
        return {
          ...userLink,
          createdAt: dateToEpochTimestamp(userLink.createdAt),
          updatedAt: dateToEpochTimestamp(userLink.updatedAt),
        };
      }),
    };
  },

  getUserLink: async (_, { linkId }, { prisma, userId }) => {
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['auth/unauthenticated'],
      };
    }

    const userLink = await prisma.userLink.findFirst({
      where: {
        linkId,
      },
    });

    if (!userLink) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['link/notFound'],
      };
    }

    return {
      status: ReturnStatus.Success,
      data: {
        ...userLink,
        createdAt: dateToEpochTimestamp(userLink.createdAt),
        updatedAt: dateToEpochTimestamp(userLink.updatedAt),
      },
    };
  },
};

const queryTypeDefs = gql`
  extend type Query {
    getUserLinks: StatusDataErrorUserLinks!
    getUserLink(linkId: String!): StatusDataErrorUserLink!
  }
`;

export { queries, queryTypeDefs };
