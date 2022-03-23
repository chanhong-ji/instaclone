import { gql } from "apollo-server";

export default gql`
  type Room {
    id: Int!
    users: [User]
    messages(lastId: Int): [Message]
    unreadTotal: Int!
    createdAt: String!
    updatedAt: String!
  }
  type Message {
    id: Int!
    payload: String!
    read: Boolean!
    user: User!
    room: Room!
    createdAt: String!
    updatedAt: String!
  }
`;
