import CustomButton from '@/components/common/custom-button';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import style from './index.module.scss';
import { useState } from 'react';
import COLORS from '@/constants/color';
import useI18n from '@/i18n/useI18N';

const { Title } = Typography;

interface Props {
  handleConfirm: () => Promise<void>;
}

export default function DisconnectBroker({ handleConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const { translate: translateDisconnectBroker } = useI18n('disconnect-broker');
  const handleDisconnectBroker = async () => {
    setLoading(true);
    await handleConfirm();
    setLoading(false);
  };

  return (
    <div className={style.removeAccountContainer}>
      <Title>
        <InfoOutlined className={style.icon} />{' '}
        {translateDisconnectBroker('title')}
      </Title>
      <div className={style.contentContainer}>
        <p>{translateDisconnectBroker('description_1')}</p>
        <p>{translateDisconnectBroker('description_2')}</p>
      </div>
      <CustomButton
        loading={loading}
        className={style.actionButton}
        backgroundColor={COLORS.SUNSET_ORANGE}
        onClick={handleDisconnectBroker}
      >
        {translateDisconnectBroker('button')}
      </CustomButton>
    </div>
  );
}
