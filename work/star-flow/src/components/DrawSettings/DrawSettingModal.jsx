import DragableModal from '@/components/DragableModal';
import { memo, useCallback, useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './DrawSettingModal.module.scss';
import { DRAW_SETTINGS } from './settings';
import { SVGClose } from '@/assets/images/svg';

const defaultSettingComponent = () => null;

const DrawSettingModal = ({
  modalContainer,
  show,
  drawType,
  values,
  onClose,
  onSave,
  onReset,
  onResetDefault,
  onChange,
}) => {
  const SettingComponent = useMemo(
    () => DRAW_SETTINGS[drawType]?.component || defaultSettingComponent,
    [drawType]
  );

  const modalContent = useMemo(
    () => <SettingComponent values={values} onChange={onChange} />,
    [onChange, values]
  );

  const renderHeader = useCallback(
    ({ id, onDoubleClick, onHide }) => (
      <Modal.Header
        id={id}
        className={styles.header}
        onDoubleClick={onDoubleClick}
      >
        <div className={styles.title}>
          {DRAW_SETTINGS[drawType]?.name ?? 'Settings'}
        </div>
        <SVGClose className={styles.closeButton} onClick={onHide} />
      </Modal.Header>
    ),
    [drawType]
  );

  return (
    <DragableModal
      show={show}
      renderHeader={renderHeader}
      onHide={onClose}
      container={modalContainer}
    >
      <Modal.Body className={styles.body}>
        <div className={styles.contentWrapper}>{modalContent}</div>
      </Modal.Body>
      <div className={styles.footer}>
        <Button
          className={`${styles.button} ${styles.primary}`}
          onClick={onSave}
        >
          Save
        </Button>
        {onResetDefault && (
          <Button className={styles.button} onClick={onResetDefault}>
            Reset to default
          </Button>
        )}
        {onReset && (
          <Button className={styles.button} onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
    </DragableModal>
  );
};

export default memo(DrawSettingModal);
