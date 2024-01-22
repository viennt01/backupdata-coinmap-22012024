import styled from './style.module.scss';
import { Modal } from 'antd';
import { ConfigProvider } from 'antd';
import { useEffect, useRef } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';

const BlurModal = ({ open, onClose, children, ...props }) => {
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

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Montserrat',
        },
      }}
    >
      <Modal
        open={open}
        onCancel={onClose}
        maskClosable={false}
        wrapClassName={styled.blurModal}
        maskStyle={{
          background: 'rgba(17, 16, 36, 0.5)',
          backdropFilter: 'blur(40px)',
        }}
        closeIcon={<CloseCircleFilled className={styled.closeIcon} />}
        footer={null}
        transitionName=""
        width={'100%'}
        zIndex={10000}
        {...props}
      >
        {children}
      </Modal>
    </ConfigProvider>
  );
};

export default BlurModal;
