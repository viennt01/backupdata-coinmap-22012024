import { memo, useCallback, useEffect, useRef, useState } from 'react';

import styles from './PaneDevider.module.scss';

const PaneDevider = ({ top, width, height, onUpdateHeight, layerId }) => {
  const [isMoving, setIsMoving] = useState(false);
  const moving = useRef(false);
  const initHeight = useRef(height);

  useEffect(() => {
    if (!moving.current) {
      initHeight.current = height;
    }
  }, [height, moving.current]);

  const handleMouseMove = useCallback(
    (e) => {
      if (moving.current) {
        if (onUpdateHeight) {
          onUpdateHeight(
            initHeight.current - e.clientY + moving.current,
            layerId
          );
        }
      }
    },
    [moving, initHeight, onUpdateHeight]
  );
  const handleEndResize = useCallback(() => {
    moving.current = 0;
    setIsMoving(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleEndResize);
  }, [moving, handleMouseMove, handleEndResize]);

  const handleStartResize = useCallback(
    (e) => {
      moving.current = e.clientY;
      setIsMoving(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEndResize);
    },
    [handleMouseMove, handleEndResize]
  );

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEndResize);
    };
  }, []);

  return (
    <div
      onMouseDown={handleStartResize}
      className={`${styles.devider} ${isMoving ? styles.moving : ''}`}
      style={{
        top,
        width,
      }}
    ></div>
  );
};

export default memo(PaneDevider);
