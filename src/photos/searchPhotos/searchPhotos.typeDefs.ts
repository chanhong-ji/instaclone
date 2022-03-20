import { gql } from "apollo-server";

export default gql`
  type Query {
    searchPhotos(hashtag: String!, lastId: Int): [Photo]
  }
`;
