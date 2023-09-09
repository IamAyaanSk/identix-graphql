import gql from "graphql-tag";

const types = gql`
  type StatusDataErrorAuth {
    status: ReturnStatus!
    data: String
    error: String
  }
`;

export { types };
