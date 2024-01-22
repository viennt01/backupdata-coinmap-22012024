import style from './style.module.scss';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { generateAffiliateQuery } from '@/utils/common';

const DeactivateModal = () => {
  const router = useRouter();
  const merchantInfo = useSelector((state) => state.common.merchantInfo);

  const handleReloadPageWithAffiliateCode = () => {
    const affiliateQuery = generateAffiliateQuery(
      merchantInfo.profile.code,
      merchantInfo.domainType
    );
    router
      .replace({
        query: {
          ...router.query,
          ...affiliateQuery,
        },
      })
      .then(() => router.reload());
  };

  const handleActive = async () => {
    if (router.pathname === '/login') {
      await router.push('/profile');
    } else if (merchantInfo.checkPermission) {
      handleReloadPageWithAffiliateCode();
    } else {
      router.reload();
    }
  };

  return (
    <div className={style.page}>
      <div
        style={{
          backgroundImage: 'url(/images/abstract.png)',
        }}
        className={`${style.pageBackgroundPound}`}
      />
      <div
        style={{
          backgroundImage: 'url(/images/grid-layout.png)',
          backgroundBlendMode: 'color-dodge',
        }}
        className={`${style.pageBackground}`}
      />
      <div className={style.popup}>
        <div className={style.popupBlur}></div>
        <div className={style.popupContainer}>
          <h1 className={style.popupTitle}>
            You are opening Cex Trading in the other Tab
          </h1>
          <p className={style.popupDescription}>
            Click active to use CEX Trading in this Tab
          </p>
          <div className={style.popupButtonContainer}>
            <button className={style.popupButton} onClick={handleActive}>
              ACTIVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivateModal;
