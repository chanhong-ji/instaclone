import client from "../../client";
import { QueryResolvers } from "../../types";

interface IUserInfo {
  username: string;
}

export default {
  Query: {
    seeProfile: (_: any, { username }: IUserInfo) =>
      client.user.findUnique({ where: { username } }),
  },
};
