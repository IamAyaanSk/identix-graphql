import gql from 'graphql-tag';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';

const mutations: MutationResolvers = {
  createLink: async (_, { details }, { prisma, userId }) => {
    if (userId) {
      // Crete new Link
      const newlink = await prisma.userLink.create({
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

      return {
        status: ReturnStatus.Success,
        data: JSON.stringify(newlink),
      };
    }

    return {
      status: ReturnStatus.Error,
      error: `User not authenticated`,
    };
  },

  deleteLink: async (_, { linkId }, { prisma, userId }) => {
    // Authorize User
    if (userId) {
      const deleteLink = await prisma.userLink.delete({
        where: {
          linkId: linkId,
        },
      });

      return {
        status: ReturnStatus.Success,
        error: JSON.stringify(deleteLink),
      };
    }

    return {
      status: ReturnStatus.Error,
      error: `User is unauthorized`,
    };
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    createLink(details: CreateLinkInput!): StatusDataErrorString!
    deleteLink(linkId: String!): StatusDataErrorString!
  }
`;

export { mutations, mutationTypeDefs };
