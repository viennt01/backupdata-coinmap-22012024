import style from './index.module.scss';
import BotListComponent from '../common/bot-list';

export default function Dashboard() {
  return (
    <>
      <h1 className={style.title}>A.I TRADING</h1>
      <BotListComponent />
    </>
  );
}
