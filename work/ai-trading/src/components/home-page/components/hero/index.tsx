import style from './index.module.scss';
import { Image } from 'antd';
import { useContext } from 'react';
import { AppContext } from '@/app-context';
import useLocale from '@/hook/use-locale';
import { ContentContext } from '@/pages/home-default';

const Hero = () => {
  const { merchantInfo } = useContext(AppContext);
  const { homePageContent } = useContext(ContentContext);
  const locale = useLocale();
  if (!homePageContent) return <></>;

  const content = homePageContent[locale];

  return (
    <section className={style.wrapper}>
      <Image
        wrapperClassName={style.heroImage}
        src={merchantInfo?.config.banner_url_1}
        alt="banner_url_1"
        preview={false}
      />
      <div className={style.featureListWrapper}>
        <div className="container">
          <div className={style.featureList}>
            <div className={`${style.feature} ${style.highlight}`}>
              <div>
                <div className={style.title}>
                  {content.features.feature_1.title}
                </div>
                <div className={style.description}>
                  {content.features.feature_1.description}
                </div>
              </div>
            </div>
            <div className={style.feature}>
              <Image
                className={style.goldDot}
                src="/svg/gold-dot.svg"
                alt="gold-dot"
                width={30}
                height={30}
                preview={false}
              />
              <div>
                <div className={style.title}>
                  {content.features.feature_2.title}
                </div>
                <div className={style.description}>
                  {content.features.feature_2.description}
                </div>
              </div>
            </div>
            <div className={style.feature}>
              <Image
                className={style.goldDot}
                src="/svg/gold-dot.svg"
                alt="gold-dot"
                width={30}
                height={30}
                preview={false}
              />
              <div>
                <div className={style.title}>
                  {content.features.feature_3.title}
                </div>
                <div className={style.description}>
                  {content.features.feature_3.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
