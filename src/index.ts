import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { config as dotenvConfig } from "dotenv";

import { schema } from "./handlers/index.js";

dotenvConfig();

export interface CustomApolloContext {
  prisma: PrismaClient;
}

const PORT = process.env.PORT || 1337;

const prisma = new PrismaClient();

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer<CustomApolloContext>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async () => ({ prisma }),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: PORT }, resolve)
);

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
