import { hash } from "bcrypt";
import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";
import client from "../../client";
import { createWriteStream } from "fs";

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
          const { filename, createReadStream } = await avatar;
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream = createReadStream();
          const writeStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
          );
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:6001/static/${newFilename}`;
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
        console.log(updatedUser);

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
