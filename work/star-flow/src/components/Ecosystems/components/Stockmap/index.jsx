import style from './index.module.scss';

export default function StockmapSection() {
  return (
    <div className={style.container}>
      <div className={style.contentContainer}>
        <div className={style.content}>
          <div className={style.title}>
            <img src="/images/ecosystems/stockmap.png" alt="" loading="lazy" />
          </div>
          <p className={style.description}>
            A trading platform for the stock market in Vietnam is coming soon
          </p>
          <progress
            className={style.progress}
            id="file"
            value="32"
            max="100"
          ></progress>
        </div>
      </div>
    </div>
  );
}
