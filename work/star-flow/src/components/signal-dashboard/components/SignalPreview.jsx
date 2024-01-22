import { SVGCloseCircle, SVGZoomPlus } from '@/assets/images/svg';
import { Modal } from 'antd';
import { useCallback, useMemo } from 'react';
import { useState } from 'react';
import style from './SignalPreview.module.scss';

const defaultImage =
  'https://images.unsplash.com/photo-1639754390580-2e7437267698?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1682&q=80';

const SignalPreview = ({ imageSrc, onClick }) => {
  const src = imageSrc ?? defaultImage;

  return (
    <div className={style.preview}>
      <img src={src} alt="Preview signal" />
      <div
        className={style.overlay}
        role="presentation"
        onClick={() => onClick(src)}
      >
        <SVGZoomPlus />
      </div>
    </div>
  );
};

export const useSignalPreviewModal = () => {
  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  const handleShowPreview = useCallback((imgSrc) => {
    setImgSrc(imgSrc);
    setShow(true);
  }, []);

  const handleHide = useCallback(() => {
    setShow(false);
    setImgSrc(null);
  }, []);

  const previewModal = useMemo(
    () => (
      <Modal
        open={show}
        modalRender={(el) => el}
        footer={null}
        maskClosable
        onCancel={handleHide}
        width="auto"
        closeIcon={<SVGCloseCircle width={48} height={48} />}
        className={style.previewModal}
        style={{ top: 135 }}
        maskStyle={{ backdropFilter: 'blur(40px)' }}
      >
        <img src={imgSrc} alt="full size preview image" />
      </Modal>
    ),
    [show, imgSrc, handleHide]
  );

  return [previewModal, handleShowPreview];
};

export default SignalPreview;
