import "dotenv/config";
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser } from "./users/user.utils";

const server = new ApolloServer({
  schema,
  // get token from http headers and send user data to all resolvers
  context: async ({ req }) => {
    const { token } = req.headers;
    if (!token || typeof token !== "string") return null;
    return { loggedInUser: await getUser(token) };
  },
});

const PORT = process.env.PORT;
server
  .listen(PORT)
  .then(() => console.log(`✨Server is running on http://localhost:${PORT}/`));
