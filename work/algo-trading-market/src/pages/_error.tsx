import ROUTERS from '@/constants/router';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface Props {
  statusCode: number;
}
function Error({ statusCode }: Props) {
  const router = useRouter();
  useEffect(() => {
    router.replace(ROUTERS.HOME);
  });
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
