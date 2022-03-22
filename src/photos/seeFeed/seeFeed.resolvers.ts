import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(
      async (_, { lastId }, { loggedInUser: { id: userId } }) =>
        client.photo.findMany({
          take: 10,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
          where: {
            OR: [
              {
                user: {
                  followers: {
                    some: {
                      id: userId,
                    },
                  },
                },
              },
              { userId },
            ],
          },
          orderBy: { createdAt: "desc" },
        })
    ),
  },
};

export default resolvers;
