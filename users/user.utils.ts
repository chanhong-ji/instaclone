import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import client from "../client";

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
  (resolver: any) => (parent: any, args: any, context: any, info: any) => {
    if (!context.loggedInUser) {
      return { ok: false, error: "no user" };
    } else {
      return resolver(parent, args, context, info);
    }
  };
