import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { internalSuccessMap } from '../../../constants/errorMaps/internalSuccessMap';

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

  return deleteLinkMutationParams;
};

afterAll(async () => {
  // Force delete the link
  await testPrismaClient.userLink.delete({
    where: {
      id: 'b8f0be11-d33c-413b-acca-4d830c84a449',
    },
  });
  // Remake the test Link again for next tests
  await testPrismaClient.userLink.create({
    data: {
      id: 'b8f0be11-d33c-413b-acca-4d830c84a449',
      userId: '28a0a72b-aa7d-4fc5-9436-e1f95d83149a',
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
