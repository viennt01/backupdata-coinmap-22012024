import style from './index.module.scss';
import useAnimation from './useAnimation';

const ITEM_CONTENT = [
  'Complete Our 4-Hour Course: Prepared by specialists to guide you through everything you need to know to catch up and running with Coinmap.',
  'Join Our Thousand-Trader Community: discuss trading ideas and find your trade-mate with our passionate society.',
  'Plus Much More: Our basic knowledge is loaded with how-to guides. Please read our blog for insightful reports and up-to-date with our special events.',
];
const Item = ({ content }) => {
  return (
    <div className={style.itemContent}>
      <div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 16C32 24.836 24.836 32 16 32C7.164 32 0 24.836 0 16C0 7.164 7.164 0 16 0C24.836 0 32 7.164 32 16Z"
            fill="#52B16F"
          />
          <path
            d="M24.4691 8.46875L13.6131 19.3376L9.13154 14.8687L6.86914 17.1311L13.6163 23.8623L26.7323 10.7311L24.4691 8.46875Z"
            fill="white"
          />
        </svg>
      </div>
      <div className={style.itemText}>{content}</div>
    </div>
  );
};
export default function EducationSection() {
  useAnimation();
  return (
    <div className={style.container}>
      <div id="education_container" className={style.contentContainer}>
        <div id="education_timeline_1" className={style.title}>
          Education
        </div>
        <div id="education_timeline_2" className={style.content}>
          <div className={style.leftContainer}>
            <div className={style.description}>
              Coinmap Education is a trading training program designed by
              Coinmap&apos;s experts with over ten years of understanding of the
              financial market.
            </div>
            <p className={style.shortDescription}>
              Coinmap can provide a long-term or short-term training course
              depending on the customer&apos;s demands.
            </p>
            <p className={style.shortDescription}>
              The content of the courses is designed to fit many different
              customer segments. From the basic to advanced needs, from classic
              theories that apply to all kinds of the market to the latest
              creations that help to use the Coinmap platform&apos;s modern
              technical analysis tools.
            </p>
          </div>
          <div className={style.rightContainer}>
            <div className={style.title}>
              You can <span>FREE</span> to access
            </div>
            <div className={style.itemContainer}>
              {ITEM_CONTENT.map((conten, i) => (
                <Item key={i} content={conten} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
