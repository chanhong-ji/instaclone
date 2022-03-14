import client from "../client";
import { hash } from "bcrypt";

interface ICreate {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
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
  },
};
