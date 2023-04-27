import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: { owner: { id: ctx.session.user.id } },
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
});
