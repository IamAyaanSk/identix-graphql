import { mutationTypeDefs, mutations } from '../../handlers/userLink/mutations';
import { queryTypeDefs, queries } from '../../handlers/userLink/queries';
import { types } from '../../handlers/userLink/gql-types';

const typeDefs = [queryTypeDefs, mutationTypeDefs, types];

export { queries, mutations, typeDefs };
