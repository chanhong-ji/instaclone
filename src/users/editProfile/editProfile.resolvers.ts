import { hash } from "bcrypt";
import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";
import client from "../../client";
import { deleteFromS3, uploadToS3 } from "../../shared/shared.utils";

const resolvers: Resolvers = {
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
          bio,
          avatar,
        },
        { loggedInUser }
      ) => {
        // check user authenthcation
        if (!loggedInUser) {
          return { ok: false };
        }

        // if avatar, add image file
        let avatarUrl = null;
        if (avatar) {
          const user = await client.user.findUnique({
            where: { id: loggedInUser.id },
            select: { avatar: true },
          });
          if (user?.avatar) await deleteFromS3(user.avatar);
          avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
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
            bio,
            ...(updatedPassword && { password: updatedPassword }),
            ...(avatarUrl && { avatar: avatarUrl }),
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
