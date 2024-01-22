import style from './Contact.module.scss';

export default function Contact() {
  return (
    <div className={style.container}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.672765161389!2d106.66585661592164!3d10.836335192280885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529f3145aecd5%3A0xa00ee0c3bcfe9a87!2sTRADING%20COFFEE!5e0!3m2!1svi!2s!4v1675137235929!5m2!1svi!2s"
        style={{ minHeight: '90vh', width: '100%' }}
        allowFullScreen=""
        loading="lazy"
      />
      <div className={style.contactContainer}>
        <h1 className={style.title}>Contact</h1>
        <div className={style.description}>We happy to hear from you</div>
        <div className={style.information}>
          <div className={style.email}>
            Email:{' '}
            <a href="mailto:coinmaptrading@coinmap.tech">
              coinmaptrading@coinmap.tech
            </a>
          </div>
          <div className={style.address}>
            Address: 54 Đ. Số 8, Phường 10, Gò Vấp, Thành phố Hồ Chí Minh,
            Vietnam
          </div>
        </div>
      </div>
    </div>
  );
}
