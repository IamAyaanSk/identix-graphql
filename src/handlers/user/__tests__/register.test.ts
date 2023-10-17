import assert from 'node:assert';
import { testApolloServer, testPrismaClient, testRedisClient } from '../../../constants/testServerClients';
import { ReturnStatus, StatusDataErrorStringResolvers } from '../../../generated/resolvers-types';
import { internalErrorMap } from '../../../constants/errorMaps/internalErrorMap';
import { internalSuccessMap } from '../../../constants/errorMaps/internalSuccessMap';
import { TESTING_DUMMY_PASSWORD, TESTING_DUMMY_USER_ID } from '../../../constants/global';

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
          password: TESTING_DUMMY_PASSWORD,
          username: isForNewUser ? 'newuser-delete' : 'existinguser',
        },
      },
    },
    {
      contextValue: {
        prisma: testPrismaClient,
        redis: testRedisClient,
        userId: isForNewUser ? null : TESTING_DUMMY_USER_ID,
      },
    },
  ];

  return registerMutationParams;
};

afterAll(async () => {
  await testPrismaClient.user.deleteMany({
    // Since delete needs a unique field
    where: {
      email: 'newuser@gmail.com',
    },
  });
});

it('register new user', async () => {
  const registerMutationParams = getRegisterMutationParams(true);

  const response = await testApolloServer.executeOperation<{
    register: StatusDataErrorStringResolvers;
  }>(registerMutationParams[0], registerMutationParams[1]);

  assert(response.body.kind === 'single');

  expect(response.body.singleResult.errors).toBeUndefined();

  console.log(response.body.singleResult.data);

  expect(response.body.singleResult.data?.register.status).toBe(ReturnStatus.Success);
  expect(response.body.singleResult.data?.register.data).toBe(internalSuccessMap['user/successRegister']);
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
  expect(response.body.singleResult.data?.register.error).toBe(internalErrorMap['user/emailAlreadyExists']);
});
