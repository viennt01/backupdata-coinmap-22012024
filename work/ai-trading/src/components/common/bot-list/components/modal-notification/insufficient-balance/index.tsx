import CustomButton from '@/components/common/custom-button';
import ROUTERS from '@/constants/router';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Link from 'next/link';
import style from './index.module.scss';
import { useContext } from 'react';
import { AppContext } from '@/app-context';
import useI18n from '@/i18n/useI18N';

const { Title } = Typography;

interface Props {
  close?: () => void;
}

export default function InsufficientBalance({ close }: Props) {
  const { appTheme } = useContext(AppContext);
  const { translate: translateDashboard } = useI18n('dashboard');

  return (
    <div className={style.insufficientContainer}>
      <Title>
        <InfoOutlined className={style.icon} />{' '}
        {translateDashboard('insufficient_balance.title')}
      </Title>
      <div className={style.contentContainer}>
        <p>
          <strong>(botname)</strong>
          {translateDashboard('insufficient_balance.description_1')}
          <br />
          {translateDashboard('insufficient_balance.description_2')}
          <Link style={{ color: appTheme.colors.primary }} href={ROUTERS.HELP}>
            {translateDashboard('insufficient_balance.description_link')}
          </Link>{' '}
          {translateDashboard('insufficient_balance.description_3')}
        </p>
      </div>
      <CustomButton className={style.actionButton} onClick={close}>
        {translateDashboard('insufficient_balance.button')}
      </CustomButton>
    </div>
  );
}
