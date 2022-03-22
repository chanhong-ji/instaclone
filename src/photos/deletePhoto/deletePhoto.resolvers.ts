import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { photoId }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: { id: photoId },
        select: { userId: true },
      });

      if (!photo) {
        return { ok: false, error: "Photo not found" };
      } else if (photo.userId !== loggedInUser.id) {
        return { ok: false, error: "Not authorized" };
      } else {
        await client.photo.delete({ where: { id: photoId } });
        return { ok: true };
      }
    }),
  },
};

export default resolvers;
