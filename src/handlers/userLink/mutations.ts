import gql from 'graphql-tag';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { errorMap } from '../../constants/errorMap.js';

const mutations: MutationResolvers = {
  createLink: async (_, { details }, { prisma, userId }) => {
    // Check if user is authorized
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['auth/unauthenticated'],
      };
    }

    // If authorized, create user link
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
        phone: details.phoneNUM,
      },
    });

    // If link not created return failed to create link  error
    if (!userLink) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['link/failCreate'],
      };
    }

    // If link created return successs message
    return {
      status: ReturnStatus.Success,
      data: 'UserLink Created Successfully',
    };
  },

  deleteLink: async (_, { linkId }, { prisma, userId }) => {
    // Check if user is authorized
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['auth/unauthenticated'],
      };
    }

    // Find link to delete
    const deleteLink = await prisma.userLink.delete({
      where: {
        linkId,
      },
    });

    // If link not deleted return link not deleted error
    if (!deleteLink) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['link/notDeleted'],
      };
    }

    // Else return success message
    return {
      status: ReturnStatus.Success,
      data: 'UserLink deleted successfully',
    };
  },

  updateLink: async (_, { linkId, details }, { prisma, userId }) => {
    // Check if user is authorized
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['auth/unauthenticated'],
      };
    }

    // Find link to update
    const updateLink = await prisma.userLink.update({
      where: {
        linkId,
      },
      data: {
        firstName: details.firstName || undefined,
        lastName: details.lastName || undefined,
        email: details.email || undefined,
        facebook: details.facebookURL || undefined,
        instagram: details.instagramURL || undefined,
        twitter: details.twitterURL || undefined,
        linkedIn: details.linkedInURL || undefined,
        website: details.websiteURL || undefined,
        phone: details.phoneNUM || undefined,
      },
    });

    // If link not found return failed to update error
    if (!updateLink) {
      return {
        status: ReturnStatus.Error,
        error: errorMap['link/failUpdate'],
      };
    }

    // Else return success message
    return {
      status: ReturnStatus.Success,
      data: 'UserLink updated successfully',
    };
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    createLink(details: CreateLinkInput!): StatusDataErrorString!
    deleteLink(linkId: String!): StatusDataErrorString!
    updateLink(linkId: String!, details: UpdateLinkInput!): StatusDataErrorString!
  }
`;

export { mutations, mutationTypeDefs };
