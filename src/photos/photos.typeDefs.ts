import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    file: String!
    caption: String
    hashtags: [Hashtag]
    user: User!
    likes: Int!
    comments: Int!
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  type Hashtag {
    id: Int!
    hashtag: String!
    photos(lastId: Int): [Photo]
    totalPhotos: Int!
    createdAt: String!
    updatedAt: String!
  }
  type Like {
    id: String!
    createdAt: String!
    updatedAt: String!
  }
`;
