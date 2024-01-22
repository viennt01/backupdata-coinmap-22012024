import { Image, Button } from 'antd';
import style from './TradingBot.module.scss';
import { getTradingBotList, getCurrencyList, getPackageList } from './fetcher';
import { useState, useEffect, useRef } from 'react';
import { ERROR_CODE } from '@/fetcher/utils';
import { BOT_STATUS } from '@/constant/codeConstants';
import BlurModal from '@/components/BlurModal';
import BotDetail from './components/BotDetail';
import BotCard from './components/BotCard';
import { CREATA_AXI_ACCOUNT_LINK } from '@/constant/axi-link';

export default function TradingBot() {
  const [botList, setBotList] = useState([]);
  const [currencyIcons, setCurrencyIcons] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [bestPackage, setBestPackage] = useState({});
  const botInfoRef = useRef();

  useEffect(() => {
    getTradingBotList()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setBotList(
            payload
              .filter((bot) => bot.status === BOT_STATUS.OPEN)
              .sort((a, b) => a.order - b.order)
          );
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    getCurrencyList()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setCurrencyIcons(
            payload.reduce((results, current) => {
              results[current.currency] = current.image_url;
              return results;
            }, {})
          );
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    getPackageList()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setBestPackage(payload[payload.length - 1]);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  const handleShowDetailModal = (botInfo) => () => {
    botInfoRef.current = botInfo;
    setShowDetailModal(true);
  };

  const handleClickCreateAccount = () => {
    window.open(CREATA_AXI_ACCOUNT_LINK);
  };

  return (
    <div className={style.tradingBotContainer}>
      <div onClick={handleClickCreateAccount} className={style.containerAxi}>
        <Image
          className={style.tradingBotBackgroundAxi}
          src={'/images/marketplace/axi.png'}
          preview={false}
          alt="info"
          layout="responsive"
        />
        <Button
          onClick={handleClickCreateAccount}
          className={style.buttonCreateAccount}
        >
          CREATE ACCOUNT
        </Button>
      </div>

      {botList.map((botInfo, index) => (
        <div className={style.tradingBotItemWrapper} key={index}>
          <BotCard
            botInfo={botInfo}
            bestPackage={bestPackage}
            handleShowDetail={handleShowDetailModal(botInfo)}
          />
        </div>
      ))}
      {showDetailModal && (
        <BlurModal
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        >
          <BotDetail
            botInfo={botInfoRef.current}
            currencyIcons={currencyIcons}
            bestPackage={bestPackage}
          />
        </BlurModal>
      )}
    </div>
  );
}
