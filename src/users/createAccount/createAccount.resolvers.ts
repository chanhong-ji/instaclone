import { hash } from "bcrypt";
import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
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
        return { ok: false, error: error };
      }
    },
  },
};

export default resolvers;
