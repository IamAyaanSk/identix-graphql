import gql from "graphql-tag";

import {
  QueryResolvers,
  ReturnStatus,
} from "../../generated/resolvers-types.js";

const queries: QueryResolvers = {
  login: (_, { email, password }, { prisma }) => {
    return {
      status: ReturnStatus.Success,
    };
  },
};

const queryTypeDefs = gql`
  extend type Query {
    login(email: String!, password: String!): StatusDataErrorAuth!
  }
`;

export { queries, queryTypeDefs };
