import CustomButton from '@/components/common/custom-button';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import style from './index.module.scss';

const { Title } = Typography;

interface Props {
  handleConfirm: () => void;
}

export default function RemoveAccount({ handleConfirm }: Props) {
  return (
    <div className={style.removeAccountContainer}>
      <Title>
        Remove account <InfoOutlined className={style.icon} />
      </Title>
      <div className={style.contentContainer}>
        <p>
          Your Trading Bot will stop auto trade. Don’t worry, you can add this
          account to this bot again any time.
        </p>
        <p className={style.highlightText}>
          You can’t login into other account to this bot.
        </p>
      </div>
      <CustomButton className={style.actionButton} onClick={handleConfirm}>
        REMOVE ACCOUNT
      </CustomButton>
    </div>
  );
}
