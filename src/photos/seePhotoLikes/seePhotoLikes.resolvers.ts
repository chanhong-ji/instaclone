import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: (_, { photoId, lastId }) =>
      client.user.findMany({
        take: 20,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        where: { likes: { some: { photoId } } },
      }),
  },
};

export default resolvers;
