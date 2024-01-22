import style from './index.module.scss';
import BotList from '@/components/home-page/components/bot-list';

export default function Marketplace() {
  return (
    <div className={style.marketplacePageContainer}>
      <BotList
        comingSoon
        title="Smart, Precise, and Profitable"
        description="The best way of maximizing returns"
      />
    </div>
  );
}
