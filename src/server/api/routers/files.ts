import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3 } from "~/server/s3";
import { env } from "~/env.mjs";

export const fileRouter = createTRPCRouter({
  getUploadS3Url: protectedProcedure
    .input(
      z.object({ projectId: z.string(), name: z.string(), type: z.string() })
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

      const file = await ctx.prisma.file.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          type: input.type,
        },
      });

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: file.id,
      });

      return await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 });
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

      const file = await ctx.prisma.file.delete({ where: { id: input.id } });

      const deleteCommand = new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: file.id,
      });
      await s3.send(deleteCommand);

      return;
    }),
});