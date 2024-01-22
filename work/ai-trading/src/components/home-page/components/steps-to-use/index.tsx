import CustomButton from '@/components/common/custom-button';
import style from './index.module.scss';
import { useRouter } from 'next/router';
import ROUTERS from '@/constants/router';
import { useContext } from 'react';
import { AppContext } from '@/app-context';
import useI18n from '@/i18n/useI18N';
import { Image } from 'antd';
import useLocale from '@/hook/use-locale';
import { ContentContext } from '@/pages/home-default';

const StepsToUse = () => {
  const router = useRouter();
  const { merchantInfo } = useContext(AppContext);
  const { translate: translateHome } = useI18n('homepage');
  const { homePageContent } = useContext(ContentContext);
  const locale = useLocale();
  if (!homePageContent) return <></>;

  const content = homePageContent[locale];

  const stepContents = [
    {
      title: content.steps_to_use.step_1.title,
      description: content.steps_to_use.step_1.description,
    },
    {
      title: content.steps_to_use.step_2.title,
      description: content.steps_to_use.step_2.description,
    },
    {
      title: content.steps_to_use.step_3.title,
      description: content.steps_to_use.step_3.description,
    },
    {
      title: content.steps_to_use.step_4.title,
      description: content.steps_to_use.step_4.description,
    },
  ];

  return (
    <section className={style.wrapper}>
      <Image
        wrapperClassName={style.heroImage}
        src={merchantInfo?.config.banner_url_2}
        alt="banner_url_2"
        preview={false}
      />
      <div className={style.stepsWrapper}>
        <div className="container">
          <div className={style.title}>
            <div className={style.content}>
              {content.steps_to_use.title.content}
            </div>
            <CustomButton
              className={style.actionButton}
              onClick={() => router.push(ROUTERS.MARKETPLACE)}
            >
              {translateHome('section-steps-to-use.button-join')}
            </CustomButton>
          </div>
          <div className={style.steps}>
            {stepContents.map((step, index) => (
              <div className={style.stepPointWrapper} key={index}>
                <div className={style.stepPoint}>{index + 1}</div>
                <div className={style.dashLine}>
                  {index === stepContents.length - 1 && (
                    <div className={style.dashLineHead} />
                  )}
                </div>
                <div className={style.stepContent}>
                  <div className={style.stepTitle}>{step.title}</div>
                  <div className={style.stepDescription}>
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsToUse;
