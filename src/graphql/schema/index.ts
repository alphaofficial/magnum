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

  type User {
    email: String
    picture: String
    isLoggedIn: Boolean
  }

  type Query {
    messages: [Message!]
    messagesByDestinationUser(email: String): [Message!]
    messagesBetweenTwoEntities(from: String!, to: String!): [Message!]
    message(email: String!): Message
    users: [User!]
    user(email: String): User
  }

  type Mutation {
    postMessage(origin_user: String!, content: String!, destination_user: String!): [Message]
    logUser(email: String, isLoggedIn: Boolean, picture: String): User
  }

  type Subscription {
    onMessages: [Message!]
    messages: [Message]
    onUserUpdate: [User!]
  }
`;
