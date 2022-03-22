import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (
        _,
        { commentId, payload },
        { loggedInUser: { id: loggedInUserId } }
      ) => {
        const comment = await client.comment.findUnique({
          where: { id: commentId },
          select: { userId: true },
        });
        if (!comment) {
          return { ok: false, error: "Comment not found" };
        } else if (comment.userId !== loggedInUserId) {
          return { ok: false, error: "Not authorized" };
        } else {
          await client.comment.update({
            where: { id: commentId },
            data: {
              payload,
            },
          });
          return { ok: true };
        }
      }
    ),
  },
};

export default resolvers;
