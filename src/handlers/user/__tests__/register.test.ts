import assert from 'node:assert';
import { testApolloServer, testPrismaClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/internalErrorMap';

const getRegisterMutationParams = (isForNewUser: boolean) => {
  const registerMutationParams = [
    {
      query: `mutation Register($details: UserRegisterInput!) {
        register(details: $details) {
          data
          error
          status
        }
      }`,
      variables: {
        details: {
          email: isForNewUser ? 'newuser@gmail.com' : 'existing@gmail.com',
          password: 'test12345',
          username: isForNewUser ? 'newuser-delete' : 'existinguser',
        },
      },
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        userId: isForNewUser ? null : '3ce1d440-319e-4596-bd15-be9acebd03c7',
      },
    },
  ];

  return registerMutationParams;
};

it('register new user', async () => {
  const registerMutationParams = getRegisterMutationParams(true);

  const response = await testApolloServer.executeOperation<{
    register: StatusDataErrorStringResolvers;
  }>(registerMutationParams[0], registerMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.register.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.register.data).toBe('User registered successfully');
});

it('register existing user', async () => {
  const registerMutationParams = getRegisterMutationParams(false);

  const response = await testApolloServer.executeOperation<{
    register: StatusDataErrorStringResolvers;
  }>(registerMutationParams[0], registerMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.register.status).toBe(ReturnStatus.Error);
  expect(response.body.singleResult.data?.register.error).toBe(internalErrorMap['user/alreadyExists']);
});
