import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: protectedResolver(
      async (_, { commentId }, { loggedInUser: { id: loggedInUserId } }) => {
        // Check if comment exists
        const comment = await client.comment.findUnique({
          where: { id: commentId },
          select: { userId: true },
        });

        if (!comment) {
          // Check is comment exists
          return { ok: false, error: "Comment not found" };
        } else if (comment.userId !== loggedInUserId) {
          // Check the owner of the comment
          return { ok: false, error: "Not authorized" };
        } else {
          // Delete comment
          await client.comment.delete({ where: { id: commentId } });
          return { ok: true };
        }
      }
    ),
  },
};

export default resolvers;
