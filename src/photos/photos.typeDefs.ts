import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    file: Upload!
    caption: String
    hashtags: [Hashtag]
    user: User!
    createdAt: String!
    updatedAt: String!
  }
  type Hashtag {
    id: Int!
    hashtag: String!
    photos: [Photo]
    createdAt: String!
    updatedAt: String!
  }
`;