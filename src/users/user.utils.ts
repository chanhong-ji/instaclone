import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

interface payload extends JwtPayload {
  id: number;
}

export const getUser = async (token: string) => {
  try {
    // getUser with token
    if (!token) return null;
    const { id } = (await jwt.verify(
      token,
      process.env.PRIVATE_KEY
    )) as payload;
    const loggedInUser = await client.user.findUnique({ where: { id } });
    if (!loggedInUser) return null;
    return loggedInUser;
  } catch (error) {
    return null;
  }
};

export const protectedResolver =
  (resolver: Resolver) => (parent: any, args: any, context: any, info: any) => {
    if (!context.loggedInUser) {
      if (info.operation.operation === "query") {
        return null;
      } else {
        return { ok: false, error: "No user for protected resolver" };
      }
    } else {
      return resolver(parent, args, context, info);
    }
  };
