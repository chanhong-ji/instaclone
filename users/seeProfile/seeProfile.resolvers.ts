import client from "../../client";

interface ISeeProfile {
  username: string;
}

export default {
  Query: {
    seeProfile: (_: any, { username }: ISeeProfile) =>
      client.user.findUnique({ where: { username } }),
  },
};
