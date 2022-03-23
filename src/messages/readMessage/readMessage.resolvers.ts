import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    readMessage: protectedResolver(
      async (_, { messageId }, { loggedInUser: { id: loggedInUserId } }) => {
        // Check message exists which satisfy the condition
        const message = await client.message.findFirst({
          where: {
            id: messageId,
            userId: { not: loggedInUserId },
            room: {
              users: { some: { id: loggedInUserId } },
            },
          },
          select: {
            id: true,
          },
        });
        if (!message) return { ok: false, error: "Message not found" };

        // Update read state of the message
        await client.message.update({
          where: { id: messageId },
          data: { read: true },
        });
        return { ok: true };
      }
    ),
  },
};

export default resolvers;
