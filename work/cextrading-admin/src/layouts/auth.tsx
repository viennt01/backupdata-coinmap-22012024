import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { myLocalStorage } from 'utils';

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    const token = myLocalStorage.get('token');
    // redirect to admin and verify token
    if (token) {
      router.push('/admin');
    }
  }, []);

  return <>{children}</>;
};
export default Layout;
