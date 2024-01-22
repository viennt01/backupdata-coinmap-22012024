import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

const ScrollWrapper = ({ children }) => {
  const [showTopCover, setShowTopCover] = useState(false);
  const [showBottomCover, setShowBottomCover] = useState(false);
  const resultListRef = useRef(null);
  const topCoverRef = useRef(null);
  const bottomCoverRef = useRef(null);

  const handleIntersect = useCallback(
    (events) => {
      if (!Array.isArray(events)) {
        return;
      }
      events.forEach((e) => {
        let flag = !e.isIntersecting;
        if (e.boundingClientRect.top === 0) {
          flag = false;
        }
        if (e.target === topCoverRef.current) {
          setShowTopCover(flag);
        } else {
          setShowBottomCover(flag);
        }
      });
    },
    [setShowTopCover, setShowBottomCover]
  );

  useEffect(() => {
    if (!resultListRef || !resultListRef.current) {
      return;
    }

    const obsever = new IntersectionObserver(handleIntersect, {
      root: resultListRef.current,
      threshold: 1,
      rootMargin: '5px',
    });
    obsever.observe(topCoverRef.current);
    obsever.observe(bottomCoverRef.current);

    return () => {
      obsever.disconnect();
    };
  }, [resultListRef.current, handleIntersect, children]);

  return (
    <div
      className={`${styles.resultList} ${
        showTopCover ? styles.hasTopCover : ''
      } ${showBottomCover ? styles.hasBottomCover : ''}`}
      ref={resultListRef}
    >
      <div ref={topCoverRef}></div>
      {children}
      <div ref={bottomCoverRef}></div>
    </div>
  );
};

export default ScrollWrapper;
