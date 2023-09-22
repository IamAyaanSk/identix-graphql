import gql from 'graphql-tag';

const types = gql`
  input UserLinkCreateInput {
    firstName: String!
    lastName: String!

    email: String!

    facebookURL: String
    instagramURL: String
    twitterURL: String
    linkedInURL: String
    websiteURL: String

    phoneURL: String
  }

  input UserLinkUpdateInput {
    firstName: String
    lastName: String

    email: String

    facebookURL: String
    instagramURL: String
    twitterURL: String
    linkedInURL: String
    websiteURL: String

    phoneURL: String
  }

  type UserLink {
    id: String!
    userId: String!
    createdAt: Int!
    updatedAt: Int!
    firstName: String!
    lastName: String!
    email: String!
    facebookURL: String
    instagramURL: String
    twitterURL: String
    linkedInURL: String
    websiteURL: String
    phoneURL: String
  }

  type StatusDataErrorUserLinks {
    status: ReturnStatus!
    data: [UserLink!]
    error: String
  }

  type StatusDataErrorUserLink {
    status: ReturnStatus!
    data: UserLink
    error: String
  }
`;

export { types };
