import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
    likes: ({ id: photoId }) => client.like.count({ where: { photoId } }),
    comments: ({ id: photoId }) => client.comment.count({ where: { photoId } }),
    isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
  },
  Hashtag: {
    photos: ({ id }, { lastId }) => {
      return client.hashtag.findUnique({ where: { id } }).photos({
        take: 15,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
    },
    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};
export default resolvers;
