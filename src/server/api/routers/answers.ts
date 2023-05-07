import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const answerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        waitingForId: z.string(),
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

      const answer = ctx.prisma.answer.create({
        data: {
          waitingForId: input.waitingForId,
          createdById: ctx.session.user.id,
          text: input.text,
        },
      });

      return answer;
    }),
});
