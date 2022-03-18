import { hash } from "bcrypt";
import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";
import client from "../../client";

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _: any,
        { firstName, lastName, username, email, password: newPassword },
        { loggedInUser }
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

export default resolvers;
