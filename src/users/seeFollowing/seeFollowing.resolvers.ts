import client from "../../client";
import { Resolvers } from "../../types";

const USER_N_ONPAGE = 8;

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }) => {
      // Check if user exists with username
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) return { ok: false, error: "User not found" };

      // Get following
      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: USER_N_ONPAGE,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });

      return { ok: true, following };
    },
  },
};

export default resolvers;
