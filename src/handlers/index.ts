import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { Resolvers } from "../generated/resolvers-types.js";
import { types as commonTypeDefs } from "./gql-types.js";

import {
  queries as userQueries,
  mutations as userMutations,
  typeDefs as userTypeDefs,
} from "./user/index.js";

const resolvers: Resolvers = {
  Query: {
    ...userQueries,
  },
  Mutation: {
    ...userMutations,
  },
};

const rootMutationAndQuery = gql`
  type Mutation {
    _empty_mutation: String
  }

  type Query {
    _empty_query: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [rootMutationAndQuery, commonTypeDefs, ...userTypeDefs],
  resolvers,
});

export { schema };
