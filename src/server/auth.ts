import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { createTransport } from "nodemailer";
import { render } from "@react-email/render";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

import SignInTemplate from "~/emails/sign-in-template";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      if (trigger === "update") {
        const updateUser = await prisma.user.findFirst({
          where: { id: token.id },
        });
        token.name = updateUser?.name;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      async sendVerificationRequest(params) {
        const { identifier, url, provider } = params;
        const transport = createTransport(provider.server);
        const user = await prisma.user.findFirst({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        });

        const html = render(
          SignInTemplate({ url, register: user?.emailVerified ? false : true }),
          {
            pretty: true,
          }
        );
        const text = render(
          SignInTemplate({ url, register: user?.emailVerified ? false : true }),
          {
            plainText: true,
          }
        );

        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: user?.emailVerified ? `Zaloguj się` : "Zarejestruj się",
          text: text,
          html: html,
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/auth-error",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
