import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const inviteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.invite.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        createdAt: true,
        project: {
          select: {
            name: true,
          },
        },
      },
    });
  }),
  createInvite: protectedProcedure
    .input(z.object({ projectId: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.email === input.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nie możesz wysłać zaproszenia dla swojego konta",
        });
      }

      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId },
        select: {
          ownerId: true,
          participants: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (project?.ownerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nie posiadasz uprawnień żeby wysłać zaproszenie",
        });
      }

      const invitedUser = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });

      if (invitedUser === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie znaleziono użytkownika o takim emailu",
        });
      }

      if (project.participants.some((item) => item.userId === invitedUser.id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ten użytkownik uczestniczy już w tym projekcie",
        });
      }

      const invite = await ctx.prisma.invite.findFirst({
        where: { projectId: input.projectId, user: { email: input.email } },
      });

      if (invite !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ten użytkownik został już zaproszony",
        });
      }

      const newInvite = await ctx.prisma.invite.create({
        data: { userId: invitedUser.id, projectId: input.projectId },
      });

      return newInvite;
    }),
  answerInvitation: protectedProcedure
    .input(z.object({ id: z.string(), type: z.enum(["ACCEPT", "DECLINE"]) }))
    .mutation(async ({ input, ctx }) => {
      const invite = await ctx.prisma.invite.findFirst({
        where: { id: input.id },
      });

      if (invite?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      if (input.type === "ACCEPT") {
        await ctx.prisma.usersInProjects.create({
          data: { projectId: invite.projectId, userId: invite.userId },
        });
      }

      await ctx.prisma.invite.delete({ where: { id: input.id } });

      return input;
    }),
});
