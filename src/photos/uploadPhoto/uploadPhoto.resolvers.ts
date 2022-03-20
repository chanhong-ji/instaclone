import { createWriteStream } from "fs";
import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";
import { hashtagProcess } from "../photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        // Create photo file
        const { filename, createReadStream } = await file;
        const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const writeStream = createWriteStream(
          process.cwd() + "/uploads/" + newFilename
        );
        readStream.pipe(writeStream);
        const fileUrl = `http://localhost:6001/static/${newFilename}`;

        // Create photo model
        await client.photo.create({
          data: {
            file: fileUrl,
            caption,
            user: { connect: { id: loggedInUser.id } },
            hashtags: { connectOrCreate: hashtagProcess(caption) },
          },
        });
        return { ok: true };
      }
    ),
  },
};

export default resolvers;
