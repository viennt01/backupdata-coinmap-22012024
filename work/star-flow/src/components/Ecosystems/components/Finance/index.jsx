import Image from 'next/image';
import style from './index.module.scss';
import useAnimation from './useAnimation';

export default function FinanceSection() {
  useAnimation();
  return (
    <div className={style.container}>
      <div id="finance_container" className={style.content}>
        <div id="finance_timeline_1" className={style.leftContainer}>
          <div className={style.imageContainer}>
            <Image
              src="/images/ecosystems/2.png"
              alt=""
              width={832}
              height={468}
              layout="responsive"
            />
          </div>
        </div>
        <div className={style.rightContainer}>
          <div className={style.rightContentContainer}>
            <div id="finance_timeline_2" className={style.title}>
              Finance
            </div>
            <p id="finance_timeline_3" className={style.shortDescription}>
              We responsible for a wide range of financial tasks, including
              financial funding, budgeting, risk management, and investment
              analysis.
            </p>
            <p id="finance_timeline_3" className={style.description}>
              With its focus on financial efficiency, strategic planning, and
              data-driven decision making, the Coinmap finance team helps ensure
              that our users have the resources and insights they needs to
              succeed in a rapidly-changing and competitive marketplace.
            </p>
            <p id="finance_timeline_3" className={style.description}>
              This can include securing financing, managing cash flow, and
              making strategic investments and other resources to ensure
              long-term success for our customer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
