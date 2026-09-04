import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

const githubClientId = process.env.GITHUB_CLIENT_ID ?? "";
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET ?? "";

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: { database: { generateId: "uuid" } },
  socialProviders:
    githubClientId && githubClientSecret
      ? { github: { clientId: githubClientId, clientSecret: githubClientSecret } }
      : {},
  plugins: [nextCookies()],
});
