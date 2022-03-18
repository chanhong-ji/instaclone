import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(
      async (_, { username }, { loggedInUser }) => {
        const ok = client.user.findFirst({ where: { username } });
        if (!ok) return { ok: false, error: "username does not exist" };

        await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            following: {
              disconnect: {
                username,
              },
            },
          },
        });

        return { ok: true };
      }
    ),
  },
};

export default resolvers;
