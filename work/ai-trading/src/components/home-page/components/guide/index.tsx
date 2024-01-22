import style from './index.module.scss';
import { Collapse } from 'antd';

import useI18n from '@/i18n/useI18N';
import { useContext, useMemo } from 'react';
import { AppContext } from '@/app-context';
import { useRouter } from 'next/router';
import { FAQ_Item } from '@/components/layout/interface';
const { Panel } = Collapse;

const Guide = () => {
  const router = useRouter();
  const { merchantInfo } = useContext(AppContext);
  const { translate: translateHome } = useI18n('homepage');

  const dataGuides = useMemo<FAQ_Item[]>(() => {
    return (merchantInfo?.faq || []).reduce<FAQ_Item[]>((result, faq) => {
      if (faq.status === 'ON') {
        result = result.concat([
          faq.data.translation[router.locale as 'en' | 'vi'],
        ]);
      }
      return result.sort((a, b) => a.order - b.order);
    }, []);
  }, [merchantInfo?.faq, router.locale]);

  if (dataGuides.length > 0) {
    return (
      <section id="help" className={style.wrapper}>
        <div
          className={`${style.background} ${
            !merchantInfo?.config.hide_background_texture ? style.image : ''
          }`}
        />
        <div className={style.guideListWrapper}>
          <div className="container">
            <div className={style.guideListTitle}>
              {translateHome('section-help.guide-title')}
            </div>
            <Collapse
              className={style.guideList}
              ghost
              expandIconPosition="end"
            >
              {(dataGuides || []).map((guide, index) => (
                <Panel key={index.toString()} header={guide.name}>
                  <div
                    className={style.contentFaqContainer}
                    dangerouslySetInnerHTML={{
                      __html: guide.answer,
                    }}
                  ></div>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </section>
    );
  }
  return null;
};

export default Guide;
