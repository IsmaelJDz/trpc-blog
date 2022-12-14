import { inferProcedureOutput } from '@trpc/server';
import { createContext, useContext } from 'react';
import { AppRouter } from '../server/route/app.router';

type TQuery = keyof AppRouter['_def']['queries'];

type InferQueryOutput<TRouterKey extends TQuery> =
  inferProcedureOutput<AppRouter['_def']['queries'][TRouterKey]>;

const UserContext = createContext<InferQueryOutput<'users.me'>>(null);

function UserContextProvider({
  children,
  value,
}: {
  children: React.ReactNode | React.ReactNode[];
  value: InferQueryOutput<'users.me'> | undefined;
}) {
  return (
    <UserContext.Provider value={value || null}>
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);

export { UserContextProvider, useUserContext };
