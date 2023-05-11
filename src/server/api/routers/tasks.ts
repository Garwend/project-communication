import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        projectId: input,
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
  getById: protectedProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.task.findFirstOrThrow({
      where: {
        id: input,
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
      await ctx.prisma.project.findFirstOrThrow({
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
      await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      await ctx.prisma.task.delete({ where: { id: input.id } });

      return;
    }),
});
