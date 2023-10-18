import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorUserLink } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { TESTING_DUMMY_USER_ID, TESTING_DUMMY_USER_LINK_ID } from '../../../constants/global';

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
        linkId: TESTING_DUMMY_USER_LINK_ID,
      },
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        redis: testRedisClient,
        userId: isForUnauthenticatedUser ? null : TESTING_DUMMY_USER_ID,
      },
    },
  ];

  return userLinkQueryParams;
};

it('display link for unauthenticated user', async () => {
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

it('display link for authenticated user', async () => {
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
      id: TESTING_DUMMY_USER_LINK_ID,
    }),
  );
});
