import style from './ConfirmDialog.module.scss';
import { SVGClose } from '@/assets/images/svg';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ConfirmDialog = ({
  title,
  titleCancel,
  titleConfirm,
  show,
  onHide,
  onCancel,
  onConfirm,
  showCancel,
  ...props
}) => {
  return (
    <Modal
      centered
      dialogClassName={style.modalConfirm}
      contentClassName={style.modalConfirmContent}
      show={show}
      onHide={onHide}
      {...props}
    >
      <Modal.Header bsPrefix={style.modalConfirmTitle}>
        <Modal.Title>{title}</Modal.Title>
        <SVGClose onClick={onHide} />
      </Modal.Header>
      <Modal.Body bsPrefix={style.modalConfirmBody}>
        {props.children}
      </Modal.Body>
      <Modal.Footer bsPrefix={style.modalConfirmFooter}>
        {showCancel && <div onClick={onCancel}>{titleCancel}</div>}
        <div className={style.primary} onClick={onConfirm}>
          {titleConfirm}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  titleCancel: PropTypes.string,
  titleConfirm: PropTypes.string,
  show: PropTypes.bool.isRequired,
  showCancel: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

ConfirmDialog.defaultProps = {
  title: '',
  titleCancel: 'CANCEL',
  titleConfirm: 'OK',
  showCancel: true,
  onCancel: () => undefined,
  onConfirm: () => undefined,
};

export default ConfirmDialog;
