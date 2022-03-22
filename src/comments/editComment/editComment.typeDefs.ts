import { gql } from "apollo-server";

export default gql`
  type EditCommentResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    editComment(commentId: Int!, payload: String!): EditCommentResult!
  }
`;
