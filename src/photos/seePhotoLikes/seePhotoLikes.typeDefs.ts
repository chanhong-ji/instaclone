import { gql } from "apollo-server";

export default gql`
  type Query {
    seePhotoLikes(photoId: Int!): [User]
  }
`;
