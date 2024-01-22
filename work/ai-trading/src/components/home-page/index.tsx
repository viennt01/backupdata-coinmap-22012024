import style from './index.module.scss';
import BotList from './components/bot-list';
import Hero from './components/hero';
import Guide from './components/guide';
import StepsToUse from './components/steps-to-use';
import useI18n from '@/i18n/useI18N';

export default function Home() {
  const { translate: translateHome } = useI18n('homepage');

  return (
    <div className={style.homePageContainer}>
      <Hero />
      <BotList title={translateHome('section-library.title')} />
      <StepsToUse />
      <Guide />
    </div>
  );
}
