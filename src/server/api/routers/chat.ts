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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getMessages: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.message.findMany({
      where: {
        projectId: input,
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
        createdAt: "asc",
      },
    });
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
          participants: {
            select: {
              userId: true,
            },
          },
        },
      });

      const message = ctx.prisma.message.create({
        data: {
          projectId: input.projectId,
          createdById: ctx.session.user.id,
          text: input.text,
        },
      });

      const client = new Ably.Rest(env.ABLY_API_KEY);
      project.participants.forEach((user) => {
        if (user.userId !== ctx.session.user.id) {
          const channel = client.channels.get(user.userId);
          void channel.publish("notify-message", {
            message: input.text,
            name: ctx.session.user.name ?? ctx.session.user.email ?? "",
          });
        }
      });

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

      return await ctx.prisma.message.update({
        where: { id: input.id },
        data: {
          text: input.text,
        },
      });
    }),
  deleteMessage: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.message.findFirstOrThrow({
        where: { id: input, createdById: ctx.session.user.id },
      });

      return await ctx.prisma.message.delete({ where: { id: input } });
    }),
});
