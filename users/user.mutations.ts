import client from "../client";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

interface ICreate {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface ILogin {
  username: string;
  password: string;
}

export default {
  Mutation: {
    createAccount: async (
      _: any,
      { firstName, lastName, username, email, password }: ICreate
    ) => {
      try {
        //   check if username or email are already on DB
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (existingUser) {
          throw new Error("This username/email is already taken");
        }
        // hash password
        const hashed = await hash(password, 10);
        // save and return a user
        return client.user.create({
          data: { firstName, lastName, username, email, password: hashed },
        });
      } catch (error) {
        console.log("Create account error", error);
        return error;
      }
    },

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
