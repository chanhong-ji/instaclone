import { gql } from "apollo-server";

export default gql`
  type DeleteCommentResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    deleteComment(commentId: Int!): DeleteCommentResult!
  }
`;
