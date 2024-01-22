import { Layout, Image } from 'antd';
import { useContext } from 'react';
import style from './index.module.scss';
import { AppContext } from '@/app-context';
import Link from 'next/link';

const { Footer } = Layout;

const AppFooter = () => {
  const { merchantInfo } = useContext(AppContext);

  return (
    <Footer className={style.appFooterWrapper}>
      <div className={`container ${style.appFooter}`}>
        <div className={style.copyRight}>
          {merchantInfo?.config.copyright ?? ''}
        </div>
        {process.env.APP_ENV !== 'production' && (
          <div className={style.version}>{process.env.VERSION}</div>
        )}
        <div className={style.socialMedia}>
          {merchantInfo?.config?.social_media?.facebook_url && (
            <Link
              href={merchantInfo?.config?.social_media?.facebook_url ?? ''}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/svg/facebook.svg"
                width={24}
                height={24}
                preview={false}
                alt="facebook"
              />
            </Link>
          )}

          {merchantInfo?.config?.social_media?.twitter_url && (
            <Link
              href={merchantInfo?.config?.social_media?.twitter_url ?? ''}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/svg/twitter.svg"
                width={24}
                height={24}
                preview={false}
                alt="twitter"
              />
            </Link>
          )}

          {merchantInfo?.config?.social_media?.telegram_url && (
            <Link
              href={merchantInfo?.config?.social_media?.telegram_url ?? ''}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/svg/telegram.svg"
                width={24}
                height={24}
                preview={false}
                alt="telegram"
              />
            </Link>
          )}

          {merchantInfo?.config?.social_media?.youtube_url && (
            <Link
              href={merchantInfo?.config?.social_media?.youtube_url ?? ''}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/svg/youtube.svg"
                width={24}
                height={24}
                preview={false}
                alt="youtube"
              />
            </Link>
          )}

          {merchantInfo?.config?.social_media?.discord_url && (
            <Link
              href={merchantInfo.config.social_media.discord_url}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/svg/discord.svg"
                width={24}
                height={24}
                preview={false}
                alt="discord"
              />
            </Link>
          )}
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
