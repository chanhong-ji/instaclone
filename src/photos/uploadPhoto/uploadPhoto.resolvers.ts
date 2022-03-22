import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";
import { hashtagProcess } from "../photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser: { id: userId } }) => {
        // Create photo file
        const fileUrl = await uploadToS3(file, userId, "photos");

        // Create photo model
        const photo = await client.photo.create({
          data: {
            file: fileUrl,
            caption,
            user: { connect: { id: userId } },
            hashtags: { connectOrCreate: hashtagProcess(caption) },
          },
        });
        return photo;
      }
    ),
  },
};

export default resolvers;
