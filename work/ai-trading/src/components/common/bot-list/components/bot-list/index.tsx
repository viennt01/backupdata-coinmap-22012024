import Loading from '@/components/loading';
import { BOT } from '../../interface';
import style from './index.module.scss';
import CardBotItem from '../card-bot-item';
import Image from 'next/image';
import { BOT_STATUS } from '@/components/common/bot-list/interface';
import { ResponseWithPayload } from '@/fetcher';
import ROUTERS from '@/constants/router';
import Link from 'next/link';
import useI18n from '@/i18n/useI18N';

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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translate: translateDashboard } = useI18n('dashboard');

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
                {translateDashboard(
                  'bot_list.bot_list_notification.description_1'
                )}
                <br />
                {translateDashboard(
                  'bot_list.bot_list_notification.description_2'
                )}
                <Link href={ROUTERS.MARKETPLACE}>Marketplace.</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
