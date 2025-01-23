// graphql/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type ApiEndpoints {
    base: String
    auth: String
    users: String
  }

  type Config {
    theme: String
    language: String
    apiEndpoints: ApiEndpoints
  }

  type BusinessData {
    companyName: String
    features: [String]
    isMaintenanceMode: Boolean
  }

  type AppData {
    config: Config
    businessData: BusinessData
  }

  type UserProfile {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    role: String!
  }

  type User {
    profile: UserProfile!
  }

  type Query {
    appData: AppData
    user(username: String!): User
    allUsers: [User!]!
  }
  
  # Server-side schema additions
    type Mutation {
      updateUserProfile(id: ID!, input: UpdateUserProfileInput!): UserProfile!
      updateUserPreferences(id: ID!, preferences: UserPreferencesInput!): User!
    }
    
    input UpdateUserProfileInput {
      firstName: String
      lastName: String
      email: String
    }
    
    input UserPreferencesInput {
      theme: String
      language: String
      notifications: Boolean
    }
`;

module.exports = typeDefs;