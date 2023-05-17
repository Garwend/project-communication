import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { arrayMove } from "@dnd-kit/sortable";

export const tasksRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        status: z.enum(["WAITING", "IN_PROGRESS", "FINISHED"]),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.task.findMany({
        where: {
          projectId: input.projectId,
          status: input.status,
        },
        include: {
          assignedTo: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
    }),
  getMyTasks: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        OR: [
          { createdBy: { id: ctx.session.user.id } },
          { assignedTo: { id: ctx.session.user.id } },
        ],
      },
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
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
  }),
  getById: protectedProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.task.findFirstOrThrow({
      where: {
        id: input,
        project: {
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      },
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).max(100),
        priority: z.enum(["NONE", "LOW", "MID", "HIGH"]),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        projectId: z.string(),
        assignedToId: z
          .string()
          .optional()
          .transform((val) => (val === "" ? undefined : val)),
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
      });

      const task = await ctx.prisma.task.create({
        data: {
          name: input.name,
          priority: input.priority,
          description: input.description,
          dueDate: input.dueDate,
          assignedToId: input.assignedToId,
          createdById: ctx.session.user.id,
          projectId: input.projectId,
        },
      });

      await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: {
          WAITING_ORDER: [task.id, ...project.WAITING_ORDER],
        },
      });

      return task;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().trim().min(1).max(100),
        priority: z.enum(["NONE", "LOW", "MID", "HIGH"]),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        projectId: z.string(),
        assignedToId: z
          .string()
          .optional()
          .transform((val) => (val === "" ? undefined : val)),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      const task = await ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          priority: input.priority,
          description: input.description,
          dueDate: input.dueDate,
          assignedTo:
            input.assignedToId === undefined
              ? {
                  disconnect: true,
                }
              : {
                  connect: {
                    id: input.assignedToId,
                  },
                },
        },
        include: {
          assignedTo: true,
        },
      });

      return task;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        projectId: z.string(),
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
      });

      const task = await ctx.prisma.task.delete({ where: { id: input.id } });

      await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: {
          [`${task.status}_ORDER`]: project[`${task.status}_ORDER`].filter(
            (item) => item !== task.id
          ),
        },
      });

      return task;
    }),
  changeStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["WAITING", "IN_PROGRESS", "FINISHED"]),
        index: z.number(),
        currentIndex: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const task = await ctx.prisma.task.findFirstOrThrow({
        where: { id: input.id },
        include: {
          project: {
            select: {
              id: true,
              WAITING_ORDER: true,
              IN_PROGRESS_ORDER: true,
              FINISHED_ORDER: true,
            },
          },
        },
      });

      if (task.status !== input.status) {
        await ctx.prisma.project.update({
          where: { id: task.project.id },
          data: {
            [`${task.status}_ORDER`]: task.project[
              `${task.status}_ORDER`
            ].filter((item) => item !== task.id),
            [`${input.status}_ORDER`]: [
              ...task.project[`${input.status}_ORDER`].slice(0, input.index),
              task.id,
              ...task.project[`${input.status}_ORDER`].slice(
                input.index,
                task.project[`${input.status}_ORDER`].length
              ),
            ],
          },
        });

        return await ctx.prisma.task.update({
          where: { id: input.id },
          data: {
            status: input.status,
          },
        });
      } else {
        await ctx.prisma.project.update({
          where: { id: task.project.id },
          data: {
            [`${task.status}_ORDER`]: arrayMove(
              task.project[`${task.status}_ORDER`],
              input.currentIndex,
              input.index
            ),
          },
        });
      }
    }),
});
