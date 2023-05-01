import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.project.findFirstOrThrow({
      where: {
        id: input,
        OR: [
          { ownerId: ctx.session.user.id },
          { participants: { some: { userId: ctx.session.user.id } } },
        ],
      },
    });
  }),
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
    });
  }),
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
        description: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      const project = ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          ownerId: ctx.session.user.id,
        },
      });
      return project;
    }),
  editProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(64),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.id },
      });

      if (project?.ownerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      const updatedProject = await ctx.prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return updatedProject;
    }),
  deleteProject: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input },
      });

      if (project?.ownerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      await ctx.prisma.project.delete({
        where: { id: input },
      });

      return;
    }),
  leaveProject: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.usersInProjects.delete({
        where: {
          userId_projectId: { projectId: input, userId: ctx.session.user.id },
        },
      });

      return;
    }),
});
