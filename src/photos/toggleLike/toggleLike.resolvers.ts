import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(async (_, { photoId }, { loggedInUser }) => {
      // Check if photo exist
      const exist = await client.photo.findUnique({
        where: { id: photoId },
      });
      if (!exist) return { ok: false, error: "No photo" };

      //   find Like and delete or update
      const like = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId,
            userId: loggedInUser.id,
          },
        },
      });
      if (like) {
        //   If already like, delete
        await client.like.delete({
          where: { id: like.id },
        });
        return { ok: true };
      } else {
        //   if unliked, like
        await client.like.create({
          data: {
            user: { connect: { id: loggedInUser.id } },
            photo: { connect: { id: photoId } },
          },
        });
        return { ok: true };
      }
    }),
  },
};

export default resolvers;
