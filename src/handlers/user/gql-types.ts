import gql from 'graphql-tag';

// Export this in index.ts when using it
const types = gql`
  input UserRegisterInput {
    email: String!
    password: String!
    username: String
    firstName: String
    lastName: String
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  input UserRequestPasswordResetInput {
    email: String!
  }

  input UserResetPasswordInput {
    password: String!
    token: String!
  }
`;

export { types };
