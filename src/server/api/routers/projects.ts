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
      include: {
        owner: true,
        participants: {
          include: {
            user: true,
          },
        },
        stages: {
          select: {
            id: true,
            stage: true,
          },
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            waitingForId: true,
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
        },
        watitngFor: {
          select: {
            _count: {
              select: {
                files: true,
                answers: true,
              },
            },
            id: true,
            name: true,
            description: true,
            createdAt: true,
            delivered: true,
          },
          orderBy: [
            {
              delivered: "asc",
            },
            {
              createdAt: "desc",
            },
          ],
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
        description: z.string().optional(),
        asanaIntegration: z.boolean(),
        asanaEmail: z
          .string()
          .optional()
          .transform((val) => (val === "" ? undefined : val)),
      })
    )
    .mutation(({ input, ctx }) => {
      const project = ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          ownerId: ctx.session.user.id,
          asanaIntegration: input.asanaIntegration,
          asanaEmail: input.asanaEmail,
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
        asanaIntegration: z.boolean(),
        asanaEmail: z
          .string()
          .optional()
          .transform((val) => (val === "" ? undefined : val)),
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
          asanaIntegration: input.asanaIntegration,
          asanaEmail: input.asanaEmail ?? null,
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
  changeStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "NONE",
          "IN_PROGRESS",
          "COMPLETED",
          "SUSPENDED",
          "CANCELLED",
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.project.findFirstOrThrow({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });

      await ctx.prisma.project.update({
        where: { id: input.id },
        data: { status: input.status },
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
  removeParticipant: protectedProcedure
    .input(z.object({ projectId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.project.findFirstOrThrow({
        where: { ownerId: ctx.session.user.id, id: input.projectId },
      });

      await ctx.prisma.usersInProjects.delete({
        where: {
          userId_projectId: {
            projectId: input.projectId,
            userId: input.userId,
          },
        },
      });

      return;
    }),
});
