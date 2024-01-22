import CustomButton from '@/components/common/custom-button';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import style from './index.module.scss';
import COLORS from '@/constants/color';
import useI18n from '@/i18n/useI18N';

const { Title } = Typography;

interface Props {
  close?: () => void;
}

export default function RemoveAccount({ close }: Props) {
  const { translate: translateDashboard } = useI18n('dashboard');

  return (
    <div className={style.removeAccountContainer}>
      <Title>
        <InfoOutlined className={style.icon} />{' '}
        {translateDashboard('remove-account.title')}
      </Title>
      <div className={style.contentContainer}>
        <p>{translateDashboard('remove-account.description_1')}</p>
        <p>{translateDashboard('remove-account.description_2')}</p>
        <p className={style.highlightText}>
          {translateDashboard('remove-account.description_highlight')}
        </p>
      </div>
      <CustomButton
        className={style.actionButton}
        backgroundColor={COLORS.SUNSET_ORANGE}
        onClick={close}
      >
        {translateDashboard('remove-account.button')}
      </CustomButton>
    </div>
  );
}
