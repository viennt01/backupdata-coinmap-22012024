import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import { LOCAL_CACHE_KEYS, URLS } from '@/config';
import { updateAbility } from '@/utils/authorize/ability';
import { headers } from '@/fetcher/utils';

const fetcher = async (url) => {
  const token = localStorage.getItem(LOCAL_CACHE_KEYS.CM_TOKEN);
  if (!token) {
    throw new Error('No auth token');
  }
  headers.setToken(token);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      m_affiliate: headers.headers.m_affiliate,
    },
  });
  if (res.status >= 300) {
    throw new Error('API Client error');
  }
  return await res.json();
};

export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const { data, error, mutate } = useSWR(
      `${URLS.API_USER_ROLES_GW}/user/profile`,
      fetcher,
      {
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        revalidateOnFocus: false,
      }
    );

    const syncLogout = (event) => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        Router.push('/login');
      }
    };

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
        mutate((v) => v, false);
      };
    }, []);

    useEffect(() => {
      if (data?.payload) {
        updateAbility(data?.payload);
      }
    }, [data]);

    if (error) {
      Router.push('/login');
      return null;
    }
    if (!data) {
      return <Loading />;
    }

    return <Component {...props} />;
  };

  return Wrapper;
};
