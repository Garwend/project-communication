import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectStageRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.projectStage.findMany({ where: { projectId: input } });
  }),
  createProjectStage: protectedProcedure
    .input(z.object({ id: z.string(), stage: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: input.id,
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      return ctx.prisma.projectStage.create({
        data: { projectId: input.id, stage: input.stage },
      });
    }),
});
