import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (
        _,
        { userId: toUserId, payload },
        { loggedInUser: { id: fromUserId } }
      ) => {
        // Check if toUser exists
        const toUser = await client.user.findUnique({
          where: { id: toUserId },
          select: { id: true },
        });
        if (!toUser) return { ok: false, error: "User not found" };

        // Check if room already exists
        const room = await client.room.findFirst({
          where: {
            AND: [
              {
                users: { some: { id: toUserId } },
              },
              {
                users: { some: { id: fromUserId } },
              },
            ],
          },
        });

        // if room exists, only add message
        if (room) {
          await client.message.create({
            data: {
              payload,
              room: { connect: { id: room.id } },
              user: { connect: { id: fromUserId } },
            },
          });
          //   if room doesn't exist, create new room
        } else {
          await client.room.create({
            data: {
              users: { connect: [{ id: fromUserId }, { id: toUserId }] },
              messages: {
                create: [{ payload, user: { connect: { id: fromUserId } } }],
              },
            },
          });
        }
        return { ok: true };
      }
    ),
  },
};

export default resolvers;
