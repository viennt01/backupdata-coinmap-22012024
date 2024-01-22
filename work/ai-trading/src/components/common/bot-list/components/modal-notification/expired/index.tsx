import CustomButton from '@/components/common/custom-button';
import ROUTERS from '@/constants/router';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useRouter } from 'next/router';
import { BOT } from '@/components/common/bot-list/interface';
import style from './index.module.scss';
import useI18n from '@/i18n/useI18N';

const { Title } = Typography;
export interface ExpiredProps {
  botsExpired: BOT[];
  close?: () => void;
}
export default function Expired({ botsExpired, close }: ExpiredProps) {
  const { translate: translateDashboard } = useI18n('dashboard');
  const router = useRouter();
  const handleClickRenewal = () => {
    router.push(ROUTERS.MARKETPLACE);
    close?.();
  };

  return (
    <div className={style.expiredContainer}>
      <Title>
        <InfoOutlined className={style.icon} />{' '}
        {translateDashboard('expired.title')}
      </Title>
      <div className={style.contentContainer}>
        <p>
          <strong>{botsExpired.map((b) => b.name).join(', ')}</strong>{' '}
          {translateDashboard('expired.description')}
        </p>
      </div>
      <CustomButton className={style.actionButton} onClick={handleClickRenewal}>
        {translateDashboard('expired.button')}
      </CustomButton>
    </div>
  );
}
