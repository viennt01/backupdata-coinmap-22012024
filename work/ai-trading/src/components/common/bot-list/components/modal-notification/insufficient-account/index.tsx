import CustomButton from '@/components/common/custom-button';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import style from './index.module.scss';
import useI18n from '@/i18n/useI18N';
import { formatNumber } from '@/utils/format-number';

const { Title } = Typography;

export interface InsufficientAccountProps {
  minBalance?: number;
  close?: () => void;
}

export default function InsufficientAccount({
  minBalance,
  close,
}: InsufficientAccountProps) {
  const { translate: translateDashboard } = useI18n('dashboard');

  return (
    <div className={style.insufficientContainer}>
      <Title>
        <InfoOutlined className={style.icon} />{' '}
        {translateDashboard('insufficient_account.title')}
      </Title>
      <div className={style.contentContainer}>
        <p>
          {translateDashboard('insufficient_account.description')}{' '}
          <span className={style.highlightText}>{`$${formatNumber(
            minBalance ?? 0
          )}`}</span>
        </p>
      </div>
      <CustomButton className={style.actionButton} onClick={close}>
        {translateDashboard('insufficient_account.button')}
      </CustomButton>
    </div>
  );
}
