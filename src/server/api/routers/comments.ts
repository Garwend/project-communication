import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        projectId: z.string(),
        text: z.string(),
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

      const task = ctx.prisma.comment.create({
        data: {
          taskId: input.taskId,
          createdById: ctx.session.user.id,
          text: input.text,
        },
      });

      return task;
    }),
});
