import * as trpc from '@trpc/server';
import {
  createPostSchema,
  getSinglePostSchema,
} from '../../schema/post.schema';
import { createRoute } from '../createRoute';

export const postRouter = createRoute()
  .mutation('create-post', {
    input: createPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        new trpc.TRPCError({
          code: 'FORBIDDEN',
          message:
            'Not authenticated, cannot create post while logged out',
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user?.id,
            },
          },
        },
      });

      return post;
    },
  })
  .query('posts', {
    resolve({ ctx }) {
      return ctx.prisma.post.findMany();
    },
  })
  .query('single-post', {
    input: getSinglePostSchema,
    resolve({ input, ctx }) {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });
    },
  });
