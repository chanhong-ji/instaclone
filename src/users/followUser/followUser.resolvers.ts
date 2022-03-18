import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(async (_, { username }, { loggedInUser }) => {
      // check if user with username
      const ok = await client.user.findFirst({ where: { username } });
      if (!ok) {
        return {
          ok: false,
          error: "username does not exist",
        };
      }
      //   update follower
      try {
        await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            following: {
              connect: {
                username,
              },
            },
          },
        });
        return {
          ok: true,
        };
      } catch (error) {
        console.log("update follower error");
        return {
          ok: false,
          error,
        };
      }
    }),
  },
};

export default resolvers;
