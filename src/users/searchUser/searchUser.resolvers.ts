import client from "../../client";
import { Resolvers } from "../../types";

const USER_N_ONPAGE = 8;

const resolvers: Resolvers = {
  Query: {
    searchUser: async (_, { keyword, lastId }) =>
      client.user.findMany({
        take: USER_N_ONPAGE,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        where: { username: { startsWith: keyword.toLowerCase() } },
      }),
  },
};

export default resolvers;
