import client from "../../client";
import { Resolvers } from "../../types";

const COMMENT_PAGE = 20;

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: async (_, { photoId, lastId }) => {
      const comments = await client.comment.findMany({
        where: { photoId },
        take: COMMENT_PAGE,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
      return comments;
    },
  },
};

export default resolvers;
