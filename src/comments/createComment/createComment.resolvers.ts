import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, payload }, { loggedInUser: { id: usreId } }) => {
        // Check photo exist
        const ok = client.photo.findUnique({
          where: { id: photoId },
          select: { id: true }, //loading small data
        });
        if (!ok) return { ok: false, error: "Photo not found" };

        // Create a comment
        await client.comment.create({
          data: {
            user: { connect: { id: usreId } },
            photo: { connect: { id: photoId } },
            payload,
          },
        });
        return { ok: true };
      }
    ),
  },
};

export default resolvers;
