import gql from 'graphql-tag';

const types = gql`
  enum ReturnStatus {
    SUCCESS
    ERROR
  }

  type StatusDataErrorString {
    status: ReturnStatus!
    data: String
    error: String
  }
`;

export { types };
