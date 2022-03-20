import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    photos: ({ id }) => client.user.findUnique({ where: { id } }).photos(),
    totalFollowing: ({ id }) =>
      client.user.count({
        where: { followers: { some: { id } } },
      }),
    totalFollowers: ({ id }) =>
      client.user.count({
        where: { following: { some: { id } } },
      }),
    isMe: ({ id }, _, { loggedInUser }) =>
      loggedInUser ? loggedInUser.id === id : false,
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      const exists = await client.user.count({
        where: {
          id: loggedInUser.id,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return exists !== 0;
    },
  },
};

export default resolvers;
