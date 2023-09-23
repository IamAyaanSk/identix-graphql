import { ApolloServer } from '@apollo/server';
import { schema } from '../handlers/index.js';
import { CustomApolloContext } from '../index.js';
import { PrismaClient } from '@prisma/client';

const testPrismaClient = new PrismaClient();

const testApolloServer = new ApolloServer<CustomApolloContext>({
  schema,
});

export { testApolloServer, testPrismaClient };
