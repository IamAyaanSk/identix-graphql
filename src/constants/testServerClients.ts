import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

import { schema } from '../handlers/index';
import { CustomApolloContext } from '../index';

const testPrismaClient = new PrismaClient();

const testRedisClient = new Redis();

const testApolloServer = new ApolloServer<CustomApolloContext>({
  schema,
});

export { testApolloServer, testPrismaClient, testRedisClient };
