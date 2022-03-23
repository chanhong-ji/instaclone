import { gql } from "apollo-server";

export default gql`
  type Mutation {
    sendMessage(userId: Int!, payload: String!): MutationResponse!
  }
`;
