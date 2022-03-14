import client from "../client";

export default {
  Query: {
    seeProfile: (_: any, { username }: { username: string }) =>
      client.user.findUnique({ where: { username } }),
  },
};
