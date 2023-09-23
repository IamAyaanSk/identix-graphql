import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { schema } from './handlers/index.js';
import { JWT_SECRET_KEY, PORT } from './constants/global.js';
import { getDecodedJWT } from './utils/getDecodedJWT.js';

export interface CustomApolloContext {
  prisma: PrismaClient;
  userId: string | null;
}

const prisma = new PrismaClient();

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer<CustomApolloContext>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token: string = req.headers.authorization || '';
      const decodedJWT = getDecodedJWT(token, JWT_SECRET_KEY);

      return { prisma, userId: decodedJWT.id || null };
    },
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
