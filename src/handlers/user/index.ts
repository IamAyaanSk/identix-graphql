import { mutationTypeDefs, mutations } from '../../handlers/user/mutations';
import { queryTypeDefs, queries } from '../../handlers/user/queries';
import { types } from '../../handlers/user/gql-types';

const typeDefs = [queryTypeDefs, mutationTypeDefs, types];

export { queries, mutations, typeDefs };
