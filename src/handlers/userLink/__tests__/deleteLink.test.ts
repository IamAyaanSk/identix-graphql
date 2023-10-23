import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { internalSuccessMap } from '../../../constants/errorMaps/internalSuccessMap';
import { TESTING_DUMMY_USER_ID, TESTING_DUMMY_USER_LINK_ID } from '../../../constants/global';

const getDeleteLinkMutationParams = (isForUnauthenticatedUser: boolean) => {
  const deleteLinkMutationParams = [
    {
      query: `mutation DeleteLink($linkId: String!) {
        deleteLink(linkId: $linkId) {
          data
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

  return deleteLinkMutationParams;
};

afterAll(async () => {
  // Force delete the link
  await testPrismaClient.userLink.delete({
    where: {
      id: TESTING_DUMMY_USER_LINK_ID,
    },
  });
  // Remake the test Link again for next tests
  await testPrismaClient.userLink.create({
    data: {
      id: TESTING_DUMMY_USER_LINK_ID,
      userId: TESTING_DUMMY_USER_ID,
      lastName: 'test',
      firstName: 'test',
      email: 'test@gmail.com',
    },
  });
});

it('delete link for unauthenticated user', async () => {
  const deleteLinkMutationParams = getDeleteLinkMutationParams(true);

  const response = await testApolloServer.executeOperation<{
    deleteLink: StatusDataErrorStringResolvers;
  }>(deleteLinkMutationParams[0], deleteLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.deleteLink.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.deleteLink.error).toBe(internalErrorMap['auth/unauthenticated']);
});

it('delete link for authenticated user', async () => {
  const deleteLinkMutationParams = getDeleteLinkMutationParams(false);

  const response = await testApolloServer.executeOperation<{
    deleteLink: StatusDataErrorStringResolvers;
  }>(deleteLinkMutationParams[0], deleteLinkMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.deleteLink.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.deleteLink.data).toBe(internalSuccessMap['userLink/successDelete']);
});