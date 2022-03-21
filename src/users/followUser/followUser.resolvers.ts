import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }, { loggedInUser: { id: userId } }) => {
        // check if user with username
        const user = await client.user.findFirst({ where: { username } });
        if (!user) {
          return {
            ok: false,
            error: "username does not exist",
          };
        }
        // unable to follow self
        if (user.id === userId)
          return { ok: false, error: "Not allow to follow yourself" };
        //   update follower
        try {
          await client.user.update({
            where: { id: userId },
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
      }
    ),
  },
};

export default resolvers;
