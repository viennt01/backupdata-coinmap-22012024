import { ROUTERS } from '@/constant/router';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Error404() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ROUTERS.HOME);
  });
  return <></>;
}
