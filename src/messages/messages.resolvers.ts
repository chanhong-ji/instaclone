import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    users: ({ id: roomId }) =>
      client.room.findUnique({ where: { id: roomId } }).users(),
    messages: ({ id: roomId }, { lastId }) =>
      client.message.findMany({
        take: 30,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        where: {
          roomId,
        },
        orderBy: { createdAt: "desc" },
      }),
    unreadTotal: ({ id: roomId }, _, { loggedInUser }) => {
      if (!loggedInUser) return 0;
      return client.message.count({
        where: {
          roomId,
          read: false,
          user: {
            id: { not: loggedInUser.id },
          },
        },
      });
    },
  },
  Message: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
  },
};

export default resolvers;
