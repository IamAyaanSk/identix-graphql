import gql from "graphql-tag";

const types = gql`
  enum ReturnStatus {
    SUCCESS
    ERROR
  }
`;

export { types };
