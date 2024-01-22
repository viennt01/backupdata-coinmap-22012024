import React, { useContext } from 'react';
import { AppContext } from '@/app-context';
import style from './index.module.scss';
import { SUPPORT_EMAIL } from '@/constants/common';
import Link from 'next/link';

const ContactSection = () => {
  const { merchantInfo } = useContext(AppContext);
  const mailSupport = merchantInfo?.config?.support?.email ?? SUPPORT_EMAIL;

  return (
    <section id="contact" className={style.section}>
      <div className="container">
        <p className={style.title}>Contact us</p>
        <p className={style.desc}>
          Get in touch and let’s make something great together. Let’s turn your
          idea on an even greater product.
        </p>
        <Link
          className={style.email}
          href={`mailto:${mailSupport}`}
          title={`Mail to ${mailSupport}`}
        >
          {mailSupport}
        </Link>
        <Link
          className={style.message}
          href={`mailto:${mailSupport}`}
          title={`Mail to ${mailSupport}`}
        >
          Feel free to send us a message
        </Link>
      </div>
    </section>
  );
};

export default ContactSection;
