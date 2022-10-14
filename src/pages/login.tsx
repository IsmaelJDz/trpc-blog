import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('../components/LoginForm'), {
  ssr: false,
});

function LoginPage() {
  <>
    <LoginForm />
  </>;
}

export default LoginPage;
