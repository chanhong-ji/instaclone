import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: (_: any, { username }) =>
      client.user.findUnique({ where: { username } }),
  },
};

export default resolvers;
