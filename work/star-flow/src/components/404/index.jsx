import Image from 'next/image';
import { useRouter } from 'next/router';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_ID } from '@/config/consts/pagePermission';

export default function Page404() {
  const router = useRouter();
  const merchantInfo = useSelector((state) => state.common.merchantInfo);
  const pageAbility = useAbility(PageAbilityContext);

  const handleGoHome = () => {
    if (!merchantInfo.checkPermission) router.push('/');
    if (
      merchantInfo.checkPermission &&
      pageAbility.can(PERMISSION_ACTIONS.VIEW, FEATURE_ID.PAGE_HOME)
    ) {
      router.push('/');
    }
    router.push(merchantInfo.profile?.config?.home_path ?? '/');
  };

  return (
    <div className={style.container404}>
      <div className={style.imageContainer}>
        <Image
          src={'/images/404.png'}
          alt="404"
          width={324}
          height={227}
          layout="intrinsic"
        />
      </div>
      <div className={style.btnContainer}>
        <button onClick={handleGoHome}>Go home</button>
      </div>
    </div>
  );
}
