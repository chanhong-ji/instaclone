import client from "../../client";
import { Resolvers } from "../../types";

const USER_N_ONPAGE = 8;

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      // Check if user exists with username
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) return { ok: false, error: "User not found" };

      // Find paginated user
      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({ skip: (page - 1) * USER_N_ONPAGE, take: USER_N_ONPAGE });

      // Find the number of user
      const totalPages = await client.user.count({
        where: {
          following: {
            some: { username },
          },
        },
      });

      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalPages / USER_N_ONPAGE),
      };
    },
  },
};

export default resolvers;
