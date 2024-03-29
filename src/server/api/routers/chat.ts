import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import * as Ably from "ably/promises";
import { env } from "~/env.mjs";

export const chatRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: {
        OR: [
          { ownerId: ctx.session.user.id },
          { participants: { some: { userId: ctx.session.user.id } } },
        ],
      },
      select: {
        id: true,
        name: true,
        messages: {
          take: 1,
          select: {
            text: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        lastChatView: {
          where: {
            userId: ctx.session.user.id,
          },
          select: {
            date: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getMessages: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const limit = 10;

      const items = await ctx.prisma.message.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          projectId: input.projectId,
          project: {
            OR: [
              { ownerId: ctx.session.user.id },
              { participants: { some: { userId: ctx.session.user.id } } },
            ],
          },
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
  createMessage: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
        select: {
          ownerId: true,
          participants: {
            select: {
              userId: true,
            },
          },
        },
      });

      const message = await ctx.prisma.message.create({
        data: {
          projectId: input.projectId,
          createdById: ctx.session.user.id,
          text: input.text,
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      const channelsId = [
        project.ownerId,
        ...project.participants.map((user) => user.userId),
      ];

      const client = new Ably.Rest(env.ABLY_API_KEY);
      for (const userId of channelsId) {
        const channel = client.channels.get(userId);
        if (userId !== ctx.session.user.id) {
          await channel.publish("notify-message", {
            message: input.text,
            name: ctx.session.user.name ?? ctx.session.user.email ?? "",
          });
        }
        await channel.publish("chat-update", {
          type: "create",
          message: message,
        });
      }

      // channelsId.forEach((userId) => {
      //   const channel = client.channels.get(userId);
      //   if (userId !== ctx.session.user.id) {
      //     void channel.publish("notify-message", {
      //       message: input.text,
      //       name: ctx.session.user.name ?? ctx.session.user.email ?? "",
      //     });
      //   }
      //   void channel.publish("chat-update", {
      //     type: "create",
      //     message: message,
      //   });
      // });

      return message;
    }),
  updateMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.message.findFirstOrThrow({
        where: { id: input.id, createdById: ctx.session.user.id },
      });

      const message = await ctx.prisma.message.update({
        where: { id: input.id },
        data: {
          text: input.text,
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      const project = await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: message.projectId,
        },
        select: {
          ownerId: true,
          participants: {
            select: {
              userId: true,
            },
          },
        },
      });

      const channelsId = [
        project.ownerId,
        ...project.participants.map((user) => user.userId),
      ];

      const client = new Ably.Rest(env.ABLY_API_KEY);
      for (const userId of channelsId) {
        const channel = client.channels.get(userId);
        await channel.publish("chat-update", {
          type: "update",
          message: message,
        });
      }
      // channelsId.forEach((userId) => {
      //   const channel = client.channels.get(userId);

      //   void channel.publish("chat-update", {
      //     type: "update",
      //     message: message,
      //   });
      // });

      return message;
    }),
  deleteMessage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.message.findFirstOrThrow({
        where: { id: input, createdById: ctx.session.user.id },
      });

      const message = await ctx.prisma.message.delete({ where: { id: input } });

      const project = await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: message.projectId,
        },
        select: {
          ownerId: true,
          participants: {
            select: {
              userId: true,
            },
          },
        },
      });

      const channelsId = [
        project.ownerId,
        ...project.participants.map((user) => user.userId),
      ];

      const client = new Ably.Rest(env.ABLY_API_KEY);

      for (const userId of channelsId) {
        const channel = client.channels.get(userId);
        await channel.publish("chat-update", {
          type: "delete",
          message: message,
        });
      }

      // channelsId.forEach((userId) => {
      //   const channel = client.channels.get(userId);

      //   void channel.publish("chat-update", {
      //     type: "delete",
      //     message: message,
      //   });
      // });

      return message;
    }),
  viewChat: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const lcv = await ctx.prisma.lastChatView.findFirst({
        where: { projectId: input, userId: ctx.session.user.id },
      });

      if (lcv) {
        await ctx.prisma.lastChatView.update({
          where: { id: lcv.id },
          data: { date: new Date() },
        });
      } else {
        await ctx.prisma.lastChatView.create({
          data: { projectId: input, userId: ctx.session.user.id },
        });
      }

      return {};
    }),
});
