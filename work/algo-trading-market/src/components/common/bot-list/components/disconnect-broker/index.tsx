import CustomButton from '@/components/common/custom-button';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import style from './index.module.scss';
import { useState } from 'react';

const { Title } = Typography;

interface Props {
  handleConfirm: () => Promise<void>;
}

export default function DisconnectBroker({ handleConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const handleDisconnectBroker = async () => {
    setLoading(true);
    await handleConfirm();
    setLoading(false);
  };

  return (
    <div className={style.removeAccountContainer}>
      <Title>
        Disconnect Broker <InfoOutlined className={style.icon} />
      </Title>
      <div className={style.contentContainer}>
        <p>
          Your Trading Bot will stop auto trade. Don’t worry, you can add this
          account to this bot again any time.
        </p>
      </div>
      <CustomButton
        loading={loading}
        className={style.actionButton}
        onClick={handleDisconnectBroker}
      >
        DISCONNECT BROKER
      </CustomButton>
    </div>
  );
}
