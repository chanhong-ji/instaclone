import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: async (_, { photoId }) => {
      const likes = await client.like.findMany({
        where: { photoId },
        select: { user: true },
      });
      return likes.map((like) => like.user);
    },
  },
};

export default resolvers;
