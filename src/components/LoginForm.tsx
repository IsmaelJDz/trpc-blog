import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';
import { CreateUserInput } from '../schema/user.schema';
import { useState } from 'react';

function VerifyToken({ hash }: { hash: string }) {
  const router = useRouter();

  const { data, isLoading } = trpc.useQuery([
    'users.verify-otp',
    {
      hash,
    },
  ]);

  if (isLoading) {
    return <p>Verifying...</p>;
  }

  router.push(
    data?.redirect.includes('login') ? '/' : data?.redirect || '/'
  );

  return <p>Redirecting...</p>;
}

function LoginForm() {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const [success, setSuccess] = useState(false);

  const { mutate, error } = trpc.useMutation(['users.request-otp'], {
    onSuccess: data => {
      setSuccess(true);
    },
  });

  const onSubmit = (values: CreateUserInput) => {
    mutate({ ...values, redirect: router.asPath });
  };

  const hash = router.asPath.split('#token=')[1];

  if (hash) {
    return <VerifyToken hash={hash} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div>{error.message}</div>}
        {success && <div>Success! check your email</div>}

        <h1>Login</h1>
        <input
          type='email'
          placeholder='jane.doe@example.com'
          {...register('email')}
        />

        <button type='submit'>Login</button>
      </form>
      <Link href='/register'>Register</Link>
    </>
  );
}

export default LoginForm;
