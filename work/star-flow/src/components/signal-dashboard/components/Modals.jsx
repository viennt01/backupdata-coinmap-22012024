import { SvgInfoFill } from '@/assets/images/svg';
import { SvgArrowRightLong } from '@/assets/images/svg/page';
import { useState } from 'react';

const { default: ModalBlur } = require('./ModalBlur');

import style from './Modals.module.scss';

const ExpiredModal = () => {
  const [open, setOpen] = useState(true);

  return (
    <ModalBlur
      okText={
        <>
          RENEWAL <SvgArrowRightLong />
        </>
      }
      cancelText="Back to Bot Dashboard"
      okButtonProps={{ className: style.btnOrange }}
      open={open}
      onCancel={() => setOpen(false)}
    >
      <div className={style.modalContent}>
        <h1>
          Expired{' '}
          <SvgInfoFill className={style.infoIcon} width={32} height={32} />
        </h1>
        <p>
          <strong>Marubozu Bot</strong> subscription has expired. Please renew a
          new plan to keep receiving signal.
        </p>
      </div>
    </ModalBlur>
  );
};

const MultiSessionFound = () => {
  const [open, setOpen] = useState(true);

  return (
    <ModalBlur
      okText={
        <>
          ACTIVE NEW SESSION <SvgArrowRightLong />
        </>
      }
      cancelText="CANCEL"
      open={open}
      onCancel={() => setOpen(false)}
    >
      <div className={style.modalContent}>
        <h1>
          Activity found{' '}
          <SvgInfoFill
            className={`${style.infoIcon} ${style.textYellow}`}
            width={32}
            height={32}
          />
        </h1>
        <p>Your Coinmap account was just signed into from another session.</p>
        <p className={style.textManual}>
          Click Active New Session to use the current session, and another
          session will become inactive
        </p>
      </div>
    </ModalBlur>
  );
};

const SignalDashboardModals = () => {
  return (
    <>
      <ExpiredModal />
      <MultiSessionFound />
    </>
  );
};
export default SignalDashboardModals;
