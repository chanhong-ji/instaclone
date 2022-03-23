import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectedResolver(
      async (_, { roomId }, { loggedInUser: { id: loggedInUserId } }) =>
        client.room.findFirst({
          where: {
            id: roomId,
            users: { some: { id: loggedInUserId } },
          },
        })
    ),
  },
};

export default resolvers;
