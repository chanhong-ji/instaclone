import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchPhotos: (_, { hashtag, lastId }) =>
      client.photo.findMany({
        take: 15,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        where: { hashtags: { some: { hashtag: hashtag.toLowerCase() } } },
      }),
  },
};

export default resolvers;
