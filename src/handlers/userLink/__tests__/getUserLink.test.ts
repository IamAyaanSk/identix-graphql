import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorUserLink } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';

const getUserLinkQuery = (isForUnauthenticatedUser: boolean) => {
  const userLinkQueryParams = [
    {
      query: `query Query($linkId: String!) {
        getUserLink(linkId: $linkId) {
          data {
            id
          }
          error
          status
        }
      }`,
      variables: {
        linkId: 'b8f0be11-d33c-413b-acca-4d830c84a449',
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

  return userLinkQueryParams;
};

it('display links for unauthenticated user', async () => {
  const userLinkQueryParams = getUserLinkQuery(true);

  const response = await testApolloServer.executeOperation<{
    getUserLink: StatusDataErrorUserLink;
  }>(userLinkQueryParams[0], userLinkQueryParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.getUserLink.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.getUserLink.error).toBe(internalErrorMap['auth/unauthenticated']);
});

it('display links for authenticated user', async () => {
  const userLinkQueryParams = getUserLinkQuery(false);

  const response = await testApolloServer.executeOperation<{
    getUserLink: StatusDataErrorUserLink;
  }>(userLinkQueryParams[0], userLinkQueryParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.getUserLink.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.getUserLink.data).toEqual(
    expect.objectContaining({
      id: 'b8f0be11-d33c-413b-acca-4d830c84a449',
    }),
  );
});
