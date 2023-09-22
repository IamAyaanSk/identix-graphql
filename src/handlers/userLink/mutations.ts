import gql from 'graphql-tag';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';
import { internalErrorMap } from '../../constants/internalErrorMap.js';
import { JOIcreateUserLinkSchema, JOIUpdateUserLinkSchema } from '../../joi/userLinkJOISchemas.js';

const mutations: MutationResolvers = {
  createLink: async (_, { details }, { prisma, userId }) => {
    try {
      await JOIcreateUserLinkSchema.validateAsync(details);

      // Check if user is authorized
      if (!userId) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['auth/unauthenticated'],
        };
      }

      // If authorized, create user link
      const userLink = await prisma.userLink.create({
        data: {
          userId: userId,
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email,
          facebookURL: details.facebookURL,
          instagramURL: details.instagramURL,
          twitterURL: details.twitterURL,
          linkedInURL: details.linkedInURL,
          websiteURL: details.websiteURL,
          phoneURL: details.phoneURL,
        },
      });

      // If link not created return failed to create link  error
      if (!userLink) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['link/failCreate'],
        };
      }

      // If link created return successs message
      return {
        status: ReturnStatus.Success,
        data: 'UserLink Created Successfully',
      };
    } catch (validationError) {
      if (validationError instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: validationError.message,
        };
      }

      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['link/failCreate'],
      };
    }
  },

  deleteLink: async (_, { linkId }, { prisma, userId }) => {
    // Check if user is authorized
    if (!userId) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['auth/unauthenticated'],
      };
    }

    // Find link to delete
    const deleteLink = await prisma.userLink.delete({
      where: {
        id: linkId,
      },
    });

    // If link not deleted return link not deleted error
    if (!deleteLink) {
      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['link/notDeleted'],
      };
    }

    // Else return success message
    return {
      status: ReturnStatus.Success,
      data: 'UserLink deleted successfully',
    };
  },

  updateLink: async (_, { linkId, details }, { prisma, userId }) => {
    try {
      await JOIUpdateUserLinkSchema.validateAsync(details);

      // Check if user is authorized
      if (!userId) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['auth/unauthenticated'],
        };
      }

      // Find link to update
      const updateLink = await prisma.userLink.update({
        where: {
          id: linkId,
        },
        data: {
          firstName: details.firstName || undefined,
          lastName: details.lastName || undefined,
          email: details.email || undefined,
          facebookURL: details.facebookURL || undefined,
          instagramURL: details.instagramURL || undefined,
          twitterURL: details.twitterURL || undefined,
          linkedInURL: details.linkedInURL || undefined,
          websiteURL: details.websiteURL || undefined,
          phoneURL: details.phoneURL || undefined,
        },
      });

      // If link not found return failed to update error
      if (!updateLink) {
        return {
          status: ReturnStatus.Error,
          error: internalErrorMap['link/failUpdate'],
        };
      }

      // Else return success message
      return {
        status: ReturnStatus.Success,
        data: 'UserLink updated successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: ReturnStatus.Error,
          error: error.message,
        };
      }

      return {
        status: ReturnStatus.Error,
        error: internalErrorMap['user/failCreate'],
      };
    }
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    createLink(details: UserLinkCreateInput!): StatusDataErrorString!
    deleteLink(linkId: String!): StatusDataErrorString!
    updateLink(linkId: String!, details: UserLinkUpdateInput!): StatusDataErrorString!
  }
`;

export { mutations, mutationTypeDefs };
