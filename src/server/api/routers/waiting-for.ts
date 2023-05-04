import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const waitingForRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.watitngFor.findFirstOrThrow({ where: { id: input } });
  }),
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1).max(64),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      return ctx.prisma.watitngFor.create({
        data: {
          name: input.name,
          description: input.description,
          projectId: input.projectId,
          createdById: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      await ctx.prisma.watitngFor.delete({ where: { id: input.id } });

      return;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        projectId: z.string(),
        name: z.string().min(1).max(64),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.findFirstOrThrow({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { participants: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      const updatedWaitingFor = await ctx.prisma.watitngFor.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return updatedWaitingFor;
    }),
});
