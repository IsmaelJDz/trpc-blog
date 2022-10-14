import { createRoute } from '../createRoute';
import { userRouter } from './user.router';

export const appRouter = createRoute().merge('users.', userRouter);

export type AppRouter = typeof appRouter;
