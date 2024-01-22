import { memo, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import createDragableDialog from './DragableDialog';

import styles from './styles.module.scss';

const DragableModal = memo(({ renderHeader, children, ...props }) => {
  const DragableDialog = useMemo(
    () =>
      createDragableDialog({
        renderHeader,
        onHide: props.onHide,
      }),
    [renderHeader, props.onHide]
  );

  return (
    <Modal
      className={styles.modal}
      animation={false}
      dialogAs={DragableDialog}
      enforceFocus={false} // if container is sectionRef, need to set enforceFocus = false. because it leads to dropdown menu of react-select cannot open
      {...props}
    >
      {children}
    </Modal>
  );
});

DragableModal.displayName = 'DragableModal';

export default DragableModal;
