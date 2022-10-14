import type { NextPage } from 'next';
import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import { useUserContext } from '../context/user.context';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const user = useUserContext();

  if (!user) {
    return <LoginForm />;
  }

  return <Link href='/dashboard'>Create postM</Link>;
};

export default Home;
