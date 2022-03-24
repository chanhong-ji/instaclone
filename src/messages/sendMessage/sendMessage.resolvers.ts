import client from "../../client";
import { SEND_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";
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
          select: { id: true },
        });

        let message = null;
        // if room exists, only add message
        if (room) {
          message = await client.message.create({
            data: {
              payload,
              room: { connect: { id: room.id } },
              user: { connect: { id: fromUserId } },
            },
          });
          //   if room doesn't exist, send message with create room
        } else {
          message = await client.message.create({
            data: {
              payload,
              room: {
                create: {
                  users: { connect: [{ id: fromUserId }, { id: toUserId }] },
                },
              },
              user: { connect: { id: fromUserId } },
            },
          });
        }
        // message subsciptions
        pubsub.publish(SEND_MESSAGE, { roomUpdates: { message } });

        return { ok: true };
      }
    ),
  },
};

export default resolvers;
