import { gql } from "apollo-server";

export default gql`
  type Query {
    seePhotoComments(photoId: Int!, lastId: Int): [Comment]
  }
`;
