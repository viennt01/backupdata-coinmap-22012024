import { CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import style from './index.module.scss';

interface Props {
  children: React.ReactNode;
  open: boolean;
  close: () => void;
}
export default function AppModal({ children, open, close }: Props) {
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return React.cloneElement<{ open: boolean; close?: () => void }>(child, {
        open,
        close,
      });
    }
    return child;
  });

  if (!open) return <></>;
  return (
    <div className={style.modalContainer}>
      <CloseOutlined onClick={close} className={style.closeIcon} />
      <div className={style.contentContainer}>{childrenWithProps}</div>
    </div>
  );
}
