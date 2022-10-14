import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';
import { CreateUserInput } from '../schema/user.schema';

function RegisterPage() {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const { mutate, error } = trpc.useMutation(
    ['users.register-user'],
    {
      onSuccess: data => {
        router.push('/login');
      },
    }
  );

  const onSubmit = (values: CreateUserInput) => {
    mutate(values);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div>{error.message}</div>}
        <h1>Register</h1>
        <input
          type='email'
          placeholder='jane.doe@example.com'
          {...register('email')}
        />
        <input type='text' placeholder='Tom' {...register('name')} />
        <button type='submit'>Register</button>
      </form>
      <Link href='/login'>Login</Link>
    </>
  );
}

export default RegisterPage;
