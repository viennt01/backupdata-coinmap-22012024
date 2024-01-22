/* eslint-disable react/display-name */
import { uniqueId } from '@coinmap/react-stockcharts/lib/utils';
import { useMemo, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Draggable from 'react-draggable';
import styles from './styles.module.scss';

const createDragableDialog = ({ renderHeader, onHide }) => {
  const DragableDialog = ({ children }) => {
    const [fullscreen, setFullscreen] = useState(false);
    const refDragable = useRef(null);
    const idRef = useRef(`modal-dialog-${uniqueId()}`);

    const dialog = useMemo(
      () => (
        <Modal.Dialog
          contentClassName={styles.content}
          size="lg"
          fullscreen={fullscreen}
          className={`${styles.dialog} ${fullscreen ? styles.fullscreen : ''}`}
        >
          {renderHeader({
            onDoubleClick: () => {
              if (refDragable && refDragable.current) {
                refDragable.current.setState({ x: 0, y: 0 }, () => {
                  setFullscreen(!fullscreen);
                });
              } else {
                setFullscreen(!fullscreen);
              }
            },
            id: idRef.current,
            onHide: onHide,
          })}
          {children}
        </Modal.Dialog>
      ),
      [children, fullscreen]
    );

    return (
      <Draggable handle={`#${idRef.current}`} ref={refDragable}>
        {dialog}
      </Draggable>
    );
  };
  return DragableDialog;
};

export default createDragableDialog;
