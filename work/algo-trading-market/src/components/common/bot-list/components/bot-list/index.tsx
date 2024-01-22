import Loading from '@/components/loading';
import { BOT } from '../../interface';
import style from './index.module.scss';
import CardBotItem from '../card-bot-item';
import Image from 'next/image';
import { BOT_STATUS } from '@/components/common/bot-list/interface';
import { ResponseWithPayload } from '@/fetcher';
import ROUTERS from '@/constants/router';
import Link from 'next/link';

interface Props {
  data: BOT[] | null;
  loading: boolean;
  handleOpenConnectBrokerModal: (bot: BOT) => void;
  handleClickBotName: (bot: BOT) => void;
  handleUpdateBotStatus: (
    item: BOT,
    status: BOT_STATUS
  ) => Promise<ResponseWithPayload<BOT>>;
}
export default function BotList({
  data,
  handleClickBotName,
  loading,
  handleOpenConnectBrokerModal,
  handleUpdateBotStatus,
}: Props) {
  if (loading) {
    return (
      <div className={style.botListContainer}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={style.botListContainer}>
      {data &&
        data.length > 0 &&
        data.map((bot) => (
          <CardBotItem
            onClickBotName={() => handleClickBotName(bot)}
            handleOpenConnectBrokerModal={() =>
              handleOpenConnectBrokerModal(bot)
            }
            handleUpdateBotStatus={handleUpdateBotStatus}
            width={'25%'}
            item={bot}
            key={bot.id}
          />
        ))}
      {data && data.length === 0 && (
        <div className={style.emptyDataContainer}>
          <div className={style.contentContainer}>
            <div className={style.icon}>
              <Image src="/svg/warning.svg" width={42} height={42} alt="" />
            </div>
            <div className={style.content}>
              <p>
                You don’t have any A.I TRADING. <br />
                Get one on <Link href={ROUTERS.MARKETPLACE}>Marketplace.</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
