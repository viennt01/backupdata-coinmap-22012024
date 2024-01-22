import CustomButton from '@/components/common/custom-button';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import style from './index.module.scss';
import useI18n from '@/i18n/useI18N';

const { Title } = Typography;

interface Props {
  close?: () => void;
}

export default function MaxDrawdownWarning({ close }: Props) {
  const { translate: translateDashboard } = useI18n('dashboard');

  return (
    <div className={style.maxDrawdownWarningContainer}>
      <Title>
        <InfoOutlined className={style.icon} />{' '}
        {translateDashboard('max_drawdown_warning.title')}
      </Title>
      <div className={style.contentContainer}>
        <p>{translateDashboard('max_drawdown_warning.description')} </p>
      </div>
      <CustomButton className={style.actionButton} onClick={close}>
        {translateDashboard('max_drawdown_warning.button')}
      </CustomButton>
    </div>
  );
}
