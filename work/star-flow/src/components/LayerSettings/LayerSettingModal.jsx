import DragableModal from '@/components/DragableModal';
import { LAYERS_MAP } from '@/config/consts/layer';
import { memo, useCallback, useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { SVGSetting, SVGClose } from '@/assets/images/svg';
import styles from './LayerSettingModal.module.scss';
import { LAYER_SETTINGS } from './settings';

const defaultSettingComponent = () => null;

const LayerSettingModal = ({
  modalContainer,
  show,
  onClose,
  layer,
  onSave,
  onResetDefault,
  onReset,
  onChange,
  values,
}) => {
  const SettingComponent = useMemo(
    () => LAYER_SETTINGS[layer?.type] || defaultSettingComponent,
    [layer?.type]
  );

  const layerTypeInfo = LAYERS_MAP[layer?.type] || {};

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
          <SVGSetting />
          {`${layerTypeInfo.name} settings`}
        </div>
        <SVGClose className={styles.closeButton} onClick={onHide} />
      </Modal.Header>
    ),
    [layerTypeInfo.name]
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

export default memo(LayerSettingModal);
