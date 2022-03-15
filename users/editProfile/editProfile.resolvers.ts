import { User } from "@prisma/client";
import { hash } from "bcrypt";
import client from "../../client";
import { MutationEditProfileArgs } from "../../types";
import { protectedResolver } from "../user.utils";

interface IContext {
  loggedInUser: User | null;
}

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _: any,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
        }: MutationEditProfileArgs,
        { loggedInUser }: IContext
      ) => {
        // check user authenthcation
        if (!loggedInUser) {
          return { ok: false };
        }

        // check if there is password input
        let updatedPassword = null;
        if (newPassword) {
          updatedPassword = await hash(newPassword, 10);
        }
        // update user
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            firstName,
            lastName,
            username,
            email,
            ...(updatedPassword && { password: updatedPassword }),
          },
        });
        if (updatedUser.id) {
          return { ok: true };
        } else {
          return { ok: false, error: "Fail to update profile" };
        }
      }
    ),
  },
};
