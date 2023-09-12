import gql from 'graphql-tag';

const types = gql`
  input CreateLinkInput {
    firstName: String!
    lastName: String!

    email: String!

    facebookURL: String
    instagramURL: String
    twitterURL: String
    linkedInURL: String
    websiteURL: String

    phoneNUM: String
  }

  input UpdateLinkInput {
    firstName: String
    lastName: String

    email: String

    facebookURL: String
    instagramURL: String
    twitterURL: String
    linkedInURL: String
    websiteURL: String

    phoneNUM: String
  }

  type UserLink {
    linkId: String!
    userId: String!
    createdAt: Int!
    updatedAt: Int!
    firstName: String!
    lastName: String!
    email: String!
    facebook: String
    instagram: String
    twitter: String
    linkedIn: String
    website: String
    phone: String
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
