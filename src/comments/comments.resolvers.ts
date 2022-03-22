import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Comment: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
  },
};

export default resolvers;
