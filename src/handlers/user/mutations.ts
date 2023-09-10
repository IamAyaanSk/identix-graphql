import gql from 'graphql-tag';

import { MutationResolvers, ReturnStatus } from '../../generated/resolvers-types.js';

const mutations: MutationResolvers = {
  async register(_, {}, {}) {
    return {
      status: ReturnStatus.Success,
    };
  },
};

const mutationTypeDefs = gql`
  extend type Mutation {
    register(email: String!, password: String!): StatusDataErrorAuth!
  }
`;

export { mutations, mutationTypeDefs };
