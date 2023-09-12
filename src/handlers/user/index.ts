import { mutationTypeDefs, mutations } from './mutations.js';
import { queryTypeDefs, queries } from './queries.js';
import { types } from './gql-types.js';

const typeDefs = [queryTypeDefs, mutationTypeDefs];

export { queries, mutations, typeDefs };
