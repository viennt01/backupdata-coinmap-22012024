import { Typography } from 'antd';
import BotListComponent from '../common/bot-list';

const { Title } = Typography;

export default function Dashboard() {
  return (
    <>
      <Title>A.I TRADING</Title>
      <BotListComponent />
    </>
  );
}
