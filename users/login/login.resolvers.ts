import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

interface ILogin {
  username: string;
  password: string;
}

export default {
  Mutation: {
    login: async (_: any, { username, password }: ILogin) => {
      // find user with username
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      // check password with db password
      const passwordOk = await compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "Password Wrong",
        };
      }
      // issue token
      const token = jwt.sign({ id: user.id }, process.env.PRIVATE_KEY ?? "", {
        expiresIn: "14d",
      });
      return {
        ok: true,
        token,
      };
    },
  },
};
