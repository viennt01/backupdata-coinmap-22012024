import { SvgBell } from '@/assets/images/svg';
import { actDelError } from '@/redux/actions/common';
import { useCallback, useMemo } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

const showTypeMapBgs = {
  info: 'info',
  success: 'success',
  error: 'danger',
  warning: 'warning',
  default: 'dark',
};

const ToastError = ({ error, onClose }) => (
  <Toast
    onClose={onClose}
    delay={error.delay}
    bg={showTypeMapBgs[error.showType || 'default']}
    autohide={!!error.delay && error.delay > 0}
  >
    <Toast.Header
      className="bg-black"
      closeButton={error.closeable}
      closeVariant="white"
    >
      <span className="rounded me-2">
        <SvgBell />
      </span>
      <strong className="me-auto">Information</strong>
    </Toast.Header>
    <Toast.Body className={error.showType === 'default' ? 'text-white' : ''}>
      {error.message}
    </Toast.Body>
  </Toast>
);

const ErrorHandler = () => {
  const errors = useSelector((state) => state.common.errors);
  const dispatch = useDispatch();

  const handleClose = useCallback(
    (errorId) => {
      dispatch(actDelError(errorId));
    },
    [dispatch]
  );

  const toastList = useMemo(() => {
    if (!errors) {
      return null;
    }

    return Object.keys(errors).map((key) => {
      const errorItem = errors[key];
      if (errorItem.type !== 'toast') {
        return null;
      }

      return (
        <ToastError
          error={errorItem}
          key={key}
          onClose={() => handleClose(key)}
        />
      );
    });
  }, [handleClose, errors]);

  return (
    <>
      <ToastContainer className="p-3" position="bottom-start">
        {toastList}
      </ToastContainer>
    </>
  );
};

export default ErrorHandler;
