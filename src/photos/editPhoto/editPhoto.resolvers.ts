import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";
import { hashtagProcess } from "../photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        // Check the owner of photo is matched
        const prevPhoto = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
          select: { hashtags: { select: { hashtag: true } } },
        });
        if (!prevPhoto) {
          return { ok: false, error: "Wrong access (wrong user or no photo)" };
        }

        await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: prevPhoto.hashtags,
              connectOrCreate: hashtagProcess(caption),
            },
          },
        });

        return { ok: true };
      }
    ),
  },
};

export default resolvers;
