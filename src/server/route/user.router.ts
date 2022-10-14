import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as trpc from '@trpc/server';

import { createRoute } from '../createRoute';
import {
  verifyOptSchema,
  requestOtpSchema,
  createUserSchema,
  crateUserOutputSchema,
} from '../../schema/user.schema';
import { sendLoginEmail } from '../../utils/mailer';
import { baseUrl } from '../../constants';
import { decode, encode } from '../../utils/base64';
import { signJwt } from '../../utils/jwt';
import { serialize } from 'cookie';

export const userRouter = createRoute()
  .mutation('register-user', {
    // Example another way to call the function
    // resolve:async (params:type) => {}

    input: createUserSchema,
    output: crateUserOutputSchema,
    async resolve({ ctx, input }) {
      const { name, email } = input;

      try {
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
          },
        });
        return user;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new trpc.TRPCError({
              code: 'CONFLICT',
              message: 'User already exists',
            });
          }
        }

        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        });
      }
    },
  })
  .mutation('request-otp', {
    input: requestOtpSchema,
    async resolve({ input, ctx }) {
      const { email, redirect } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: baseUrl,
        email: user.email,
      });

      // Send email to user

      return true;
    },
  })
  .query('verify-otp', {
    input: verifyOptSchema,
    async resolve({ input, ctx }) {
      const decoded = decode(input.hash).split(':');
      const [email, id] = decoded;

      const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      });

      if (!token) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'Invalid token',
        });
      }

      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      ctx.res.setHeader(
        'Set-Cookie',
        serialize('token', jwt, { path: '/' })
      );

      return {
        redirect: token.redirect,
      };
    },
  })
  .query('me', {
    resolve({ ctx }) {
      return ctx.user;
    },
  });
