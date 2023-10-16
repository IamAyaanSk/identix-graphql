import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { internalSuccessMap } from '../../../constants/errorMaps/internalSuccessMap';

const getupdateLinkMutationParams = (isForUnauthenticatedUser: boolean) => {
  const updateLinkMutationParams = [
    {
      query: `mutation Mutation($linkId: String!, $details: UserLinkUpdateInput!) {
        updateLink(linkId: $linkId, details: $details) {
          data
          error
          status
        }
      }`,
      variables: {
        linkId: 'b8f0be11-d33c-413b-acca-4d830c84a449',
        details: {
          email: 'test@gmail.com',
        },
      },
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        redis: testRedisClient,
        userId: isForUnauthenticatedUser ? null : '28a0a72b-aa7d-4fc5-9436-e1f95d83149a',
      },
    },
  ];

  return updateLinkMutationParams;
};

it('delete link for unauthenticated user', async () => {
  const updateLinkMutationParams = getupdateLinkMutationParams(true);

  const response = await testApolloServer.executeOperation<{
    updateLink: StatusDataErrorStringResolvers;
  }>(updateLinkMutationParams[0], updateLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.updateLink.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.updateLink.error).toBe(internalErrorMap['auth/unauthenticated']);
});

it('delete link for authenticated user', async () => {
  const updateLinkMutationParams = getupdateLinkMutationParams(false);

  const response = await testApolloServer.executeOperation<{
    updateLink: StatusDataErrorStringResolvers;
  }>(updateLinkMutationParams[0], updateLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.updateLink.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.updateLink.data).toBe(internalSuccessMap['userLink/successUpdate']);
});
