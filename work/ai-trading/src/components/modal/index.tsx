import { CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import style from './index.module.scss';
import ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode;
  open: boolean;
  close: () => void;
  noPadding?: boolean;
}

export default function AppModal({ children, open, close, noPadding }: Props) {
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

  const modal = (
    <div
      className={`${style.modalContainer} ${noPadding ? style.noPadding : 0}`}
    >
      <CloseOutlined onClick={close} className={style.closeIcon} />
      <div className={style.contentContainer}>{childrenWithProps}</div>
    </div>
  );

  if (!open) return <></>;

  return ReactDOM.createPortal(modal, document.body);
}
