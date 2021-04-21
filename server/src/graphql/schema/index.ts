import { gql } from 'apollo-server-express';

// Construct a schema, using GraphQL schema language
export const typeDefs = gql`
  type Message {
    _id: String
    origin_user: String!
    content: String!
    destination_user: String!
    createdAt: String
  }

  type Users {
    email: String!
    picture: String
    isLoggedIn: Boolean
  }

  type Query {
    messages: [Message!]
    messagesByDestinationUser(email: String): [Message!]
    messagesBetweenTwoEntities(from: String, to: String): [Message!]
    message(email: String!): Message
    users: [Users!]
    user: Users
  }

  type Mutation {
    postMessage(origin_user: String!, content: String!, destination_user: String!): String
    logUser(email: String!, isLoggedIn: Boolean, picture: String): String
  }

  type Subscription {
    onMessages: [Message!]
    onUserUpdate: [Users!]
  }
`;
