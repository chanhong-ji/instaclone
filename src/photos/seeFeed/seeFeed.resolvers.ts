import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(
      async (_, __, { loggedInUser: { id: userId } }) =>
        client.photo.findMany({
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
