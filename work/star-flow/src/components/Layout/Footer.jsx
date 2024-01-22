import Icons from '@/components/HomePage/components/Icons';
import Link from 'next/link';
import { Layout } from 'antd';
import style from './Footer.module.scss';
import { useSelector } from 'react-redux';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_ID } from '@/config/consts/pagePermission';

const COINMAP_SOCIALS = {
  FACEBOOK: {
    icon: Icons.names.facebook,
    href: 'https://www.facebook.com/CoinmapTrading',
  },
  TWITTER: {
    icon: Icons.names.twitter,
    href: 'https://twitter.com/CoinmapTrading',
  },
  TELEGRAM: {
    icon: Icons.names.telegram,
    href: 'https://t.me/coinmapcextrading',
  },
  YOUTUBE: {
    icon: Icons.names.youtube,
    href: 'https://www.youtube.com/channel/UCDGZIkyP-MpfhW11juVbsRg',
  },
  DISCORD: {
    icon: Icons.names.discord,
    href: '',
  },
};

const { Footer: AntdFooter } = Layout;

const Footer = () => {
  const [checkPermission, config, socialMedia] = useSelector((state) => [
    state.common.merchantInfo.checkPermission,
    state.common.merchantInfo.profile.config,
    state.common.merchantInfo.profile.config.social_media ?? {},
  ]);
  const pageAbility = useAbility(PageAbilityContext);

  const canIChange = (featureId) =>
    checkPermission && pageAbility.can(PERMISSION_ACTIONS.UPDATE, featureId);

  const renderSocialMediaIcon = (featureId, newHref, defaultSocial) => {
    const href = canIChange(featureId) ? newHref : defaultSocial.href;
    if (!href) return <></>;
    return (
      <li>
        <a href={href} target="_blank" rel="noreferrer">
          <Icons width={24} height={24} name={defaultSocial.icon} />
        </a>
      </li>
    );
  };

  return (
    <AntdFooter className={style.antdFooter}>
      <footer className={style.container}>
        <div className={style.content}>
          <div className={style.logo}>
            <Link href="/" passHref>
              <div>
                <img
                  src={
                    canIChange(FEATURE_ID.FOOTER_LOGO)
                      ? config.rect_logo_url
                      : '/images/logo-page/logo-coinmap.png'
                  }
                  alt="logo-coinmap"
                  width={240}
                  height={45}
                />
              </div>
            </Link>
          </div>

          <div className={style.copyright}>
            {canIChange(FEATURE_ID.FOOTER_COPYRIGHT) ? (
              <p>{config.copyright}</p>
            ) : (
              <p>Copyright 2022 by Coinmap. All rights reserved.</p>
            )}
            {process.env.APP_ENV !== 'production' && (
              <p>Version: {process.env.VERSION}</p>
            )}
          </div>

          <ul className={style.socialLink}>
            {renderSocialMediaIcon(
              FEATURE_ID.MEDIA_FACEBOOK,
              socialMedia?.facebook_url,
              COINMAP_SOCIALS.FACEBOOK
            )}
            {renderSocialMediaIcon(
              FEATURE_ID.MEDIA_TWITTER,
              socialMedia?.twitter_url,
              COINMAP_SOCIALS.TWITTER
            )}
            {renderSocialMediaIcon(
              FEATURE_ID.MEDIA_TELEGRAM,
              socialMedia?.telegram_url,
              COINMAP_SOCIALS.TELEGRAM
            )}
            {renderSocialMediaIcon(
              FEATURE_ID.MEDIA_DISCORD,
              socialMedia?.discord_url,
              COINMAP_SOCIALS.DISCORD
            )}
            {renderSocialMediaIcon(
              FEATURE_ID.MEDIA_YOUTUBE,
              socialMedia?.youtube_url,
              COINMAP_SOCIALS.YOUTUBE
            )}
          </ul>
        </div>
      </footer>
    </AntdFooter>
  );
};

export default Footer;
