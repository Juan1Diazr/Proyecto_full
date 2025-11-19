'use client';

import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
};

export default LogoutButton;
