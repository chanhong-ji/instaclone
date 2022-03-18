import "dotenv/config";
const { ApolloServer } = require("apollo-server-express");
import schema from "./schema";
import { getUser } from "./users/user.utils";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload";
import morgan from "morgan";

const PORT = process.env.PORT;

async function startServer() {
  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }: any) => {
      const { token } = req.headers;
      if (!token || typeof token !== "string") return null;
      return { loggedInUser: await getUser(token) };
    },
  });
  await apolloServer.start();

  const app = express();

  app.use(graphqlUploadExpress());
  app.use(morgan("dev"));
  app.use("/static", express.static("uploads"));
  apolloServer.applyMiddleware({ app });

  await new Promise<void>((r) => app.listen({ port: PORT }, r));

  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

startServer();
