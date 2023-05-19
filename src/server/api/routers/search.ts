import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const searchRouter = createTRPCRouter({
  search: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    if (input.trim().length === 0) {
      return { projects: [], tasks: [], files: [] };
    }

    const projects = await ctx.prisma.project.findMany({
      where: {
        name: {
          contains: input,
          mode: "insensitive",
        },
        OR: [
          { ownerId: ctx.session.user.id },
          { participants: { some: { userId: ctx.session.user.id } } },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const tasks = await ctx.prisma.task.findMany({
      where: {
        name: {
          contains: input,
          mode: "insensitive",
        },
        project: {
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const files = await ctx.prisma.file.findMany({
      where: {
        name: {
          contains: input,
          mode: "insensitive",
        },
        project: {
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        projectId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { projects, tasks, files };
  }),
});
