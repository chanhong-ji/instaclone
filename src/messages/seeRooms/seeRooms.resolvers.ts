import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Query: {
    seeRooms: protectedResolver(
      async (_, { lastId }, { loggedInUser: { id: userId } }) =>
        client.room.findMany({
          take: 10,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
          where: { users: { some: { id: userId } } },
        })
    ),
  },
};

export default resolvers;
