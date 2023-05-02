import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fileRouter = createTRPCRouter({
  getUploadS3Url: protectedProcedure
    .input(
      z.object({ projectId: z.string(), name: z.string(), type: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          type: input.type,
        },
      });

      return file;
    }),
});
