import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

import { env } from "~/env.mjs";
import * as Ably from "ably/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).setHeader("content-type", "application/json").json({
      errorMessage: `UNAUTHORIZED`,
    });
  }

  if (!env.ABLY_API_KEY) {
    return res
      .status(500)
      .setHeader("content-type", "application/json")
      .json({
        errorMessage: `Missing ABLY_API_KEY environment variable.
                If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
                If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY. 
                Please see README.md for more details on configuring your Ably API Key.`,
      });
  }

  const client = new Ably.Rest(env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: session.user.id,
  });
  return res.status(200).json(tokenRequestData);
}
