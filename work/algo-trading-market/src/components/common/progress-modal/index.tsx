import React, { useRef } from 'react';
import { useEffect } from 'react';
import style from './index.module.scss';
import { Spin } from 'antd';

interface Props {
  open: boolean;
}
export default function ProgressModal({ open }: Props) {
  const preventScroll = useRef(false);

  // prevent body scroll when opening modal
  useEffect(() => {
    const { overflow } = document.body.style;
    if (open) {
      preventScroll.current = overflow === 'hidden' ? false : true;
    }
    if (preventScroll.current) {
      document.body.style.overflow = open ? 'hidden' : 'initial';
    }
    return () => {
      if (preventScroll.current) {
        document.body.style.overflow = 'initial';
      }
    };
  }, [open]);

  if (!open) return <></>;

  return (
    <div className={style.modalContainer}>
      <div className={style.contentContainer}>
        <Spin tip="Progressing..." size="large" />
      </div>
    </div>
  );
}
