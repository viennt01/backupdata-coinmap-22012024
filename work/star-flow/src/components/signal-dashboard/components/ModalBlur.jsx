import { Modal } from 'antd';

import style from './ModalBlur.module.scss';

/**
 * Modal with blur mask
 *
 * @param {import('antd').ModalProps} { children, ...props }
 */
const ModalBlur = ({ children, ...props }) => {
  return (
    <Modal
      className={style.modalBlur}
      maskClosable={false}
      maskStyle={{ backdropFilter: 'blur(40px)' }}
      cancelButtonProps={{ type: 'ghost' }}
      closable={false}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default ModalBlur;
