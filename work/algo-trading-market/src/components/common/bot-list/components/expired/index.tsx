import CustomButton from '@/components/common/custom-button';
import ROUTERS from '@/constants/router';
import { InfoOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useRouter } from 'next/router';
import { BOT } from '../../interface';
import style from './index.module.scss';

const { Title } = Typography;
interface Props {
  botsExpired: BOT[];
}
export default function Expired({ botsExpired }: Props) {
  const router = useRouter();
  const handleClickRenewal = () => {
    router.push(ROUTERS.MARKETPLACE);
  };

  return (
    <div className={style.expiredContainer}>
      <Title>
        Expired <InfoOutlined className={style.icon} />
      </Title>
      <div className={style.contentContainer}>
        <p>
          <strong>{botsExpired.map((b) => b.name).join(', ')}</strong> has
          expired.
          <br />
          Please renew a new plan to keep auto trading.
        </p>
      </div>
      <CustomButton className={style.actionButton} onClick={handleClickRenewal}>
        RENEWAL
      </CustomButton>
    </div>
  );
}
