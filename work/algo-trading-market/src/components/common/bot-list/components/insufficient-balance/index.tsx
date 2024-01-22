import CustomButton from '@/components/common/custom-button';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import style from './index.module.scss';

const { Title } = Typography;

interface Props {
  handleConfirm: () => void;
}

export default function InsufficientBalance({ handleConfirm }: Props) {
  return (
    <div className={style.insufficientContainer}>
      <Title>
        Insufficient balance <InfoOutlined className={style.icon} />
      </Title>
      <div className={style.contentContainer}>
        <p>
          <strong>(botname)</strong> has stopped working caused by your balance
          is lower than the minimum requirement. Please keep your balance higher
          than minimum balance requirement.
        </p>
      </div>
      <CustomButton className={style.actionButton} onClick={handleConfirm}>
        I UNDERSTAND
      </CustomButton>
    </div>
  );
}
