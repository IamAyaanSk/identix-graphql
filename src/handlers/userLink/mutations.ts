import gql from 'graphql-tag';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { errorMap } from '../../constants/errorMap.js';

const mutations: MutationResolvers = {
  createLink: async (_, { details }, { prisma, userId }) => {
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['auth/unauthenticated'],
      };
    }

    const userLink = await prisma.userLink.create({
      data: {
        userId: userId,
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        facebook: details.facebookURL,
        instagram: details.instagramURL,
        twitter: details.twitterURL,
        linkedIn: details.linkedInURL,
        website: details.websiteURL,
        phone: details.phoneURL,
      },
    });

    if (!userLink) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['user/failCreate'],
      };
    }

    return {
      status: ReturnStatus.Success,
      data: 'UserLink Created Successfully',
    };
  },

  deleteLink: async (_, { linkId }, { prisma, userId }) => {
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['auth/unauthenticated'],
      };
    }

    const deleteLink = await prisma.userLink.delete({
      where: {
        linkId,
      },
    });

    if (!deleteLink) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['link/notFound'],
      };
    }

    return {
      status: ReturnStatus.Success,
      data: 'UserLink deleted successfully',
    };
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    createLink(details: CreateLinkInput!): StatusDataErrorString!
    deleteLink(linkId: String!): StatusDataErrorString!
    updateLink(linkId: String!, details:)
  }
`;

export { mutations, mutationTypeDefs };
