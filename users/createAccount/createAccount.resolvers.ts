import { hash } from "bcrypt";
import client from "../../client";
import { MutationCreateAccountArgs } from "../../types";

export default {
  Mutation: {
    createAccount: async (
      _: any,
      {
        firstName,
        lastName,
        username,
        email,
        password,
      }: MutationCreateAccountArgs
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
        await client.user.create({
          data: { firstName, lastName, username, email, password: hashed },
        });
        return { ok: true };
      } catch (error) {
        console.log("Create account error", error);
        return { ok: false, error };
      }
    },
  },
};
