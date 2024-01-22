import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { confirmEmail } from './fetcher';
import style from './style.module.scss';

const ConfirmEmail = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (router.query) {
      const { token } = router.query;
      confirmEmail({ token }).then((res) => setMessage(res.message));
    }
  }, [router.query]);
  return (
    <div className={style.wrappedFilePage}>
      <div className={style.content}>{message}</div>
    </div>
  );
};

export default ConfirmEmail;
