import client from "../../client";
import { SEND_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";

const resolvers = {
  Subscription: {
    roomUpdates: {
      // condition for starting subsciption
      subscribe: async (_: any, { roomId }: any, { loggedInUser }: any) => {
        const room = await client.room.findFirst({
          where: { id: roomId, users: { some: { id: loggedInUser.id } } },
        });
        if (!room) throw new Error("Not authorized");
        return pubsub.asyncIterator(SEND_MESSAGE);
      },

      // condition for getting message while subsciprtion
      resolve: async (
        { roomUpdates: { message } }: any,
        { roomId }: any,
        { loggedInUser }: any
      ) => {
        if (message.roomId !== roomId) throw new Error("Not authorized");
        const room = await client.room.findFirst({
          where: { id: roomId, users: { some: { id: loggedInUser.id } } },
          select: { id: true },
        });
        if (!room) throw new Error("Not authorized");
        return message;
      },
    },
  },
};

export default resolvers;
