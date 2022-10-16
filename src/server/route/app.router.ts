import { createRoute } from '../createRoute';
import { userRouter } from './user.router';
import { postRouter } from './post.router';

export const appRouter = createRoute()
  .merge('users.', userRouter)
  .merge('posts.', postRouter);

export type AppRouter = typeof appRouter;
