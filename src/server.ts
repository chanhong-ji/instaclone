import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createServer } from "http";
import schema from "./schema";
import morgan from "morgan";
import { getUser } from "./users/user.utils";
import { graphqlUploadExpress } from "graphql-upload";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const PORT = process.env.PORT;

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const { token } = req.headers;
      if (!token || typeof token !== "string") return null;
      return { loggedInUser: await getUser(token) };
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      // context for subscription server
      onConnect: async ({ token }: any) => {
        const loggedInUser = await getUser(token);
        return { loggedInUser };
      },
    },
    {
      server: httpServer,
      path: apolloServer.graphqlPath,
    }
  );

  await apolloServer.start();
  app.use(graphqlUploadExpress());
  app.use(morgan("dev"));
  app.use("/static", express.static("uploads"));
  apolloServer.applyMiddleware({ app });

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
}

startServer();
