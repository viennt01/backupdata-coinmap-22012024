import { useCallback, useEffect, useRef, useState } from 'react';
import DrawFloatBar from './DrawFloatBar';

const findSelectedItem = (draws) => {
  for (const drawType in draws) {
    const items = draws[drawType];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.selected) {
        return { drawType, item };
      }
    }
  }
  return null;
};

const DrawFloatBarWrapper = ({ chartId, draws, actions }) => {
  const [positionXY, setPositionXY] = useState({ x: 0, y: 0 });
  const currentSelectedItem = useRef(null);
  const [showBar, setShowBar] = useState(true);
  const floatBarRef = useRef(null);
  const [defaultCenter, setDefaultCenter] = useState(true);

  const onDrop = useCallback(
    (x, y) => {
      setPositionXY({ x, y });
    },
    [setPositionXY]
  );

  const selectedItem = findSelectedItem(draws);
  const isChangeSelect =
    selectedItem?.item?.id !== currentSelectedItem.current?.item?.id;
  if (isChangeSelect) {
    currentSelectedItem.current = selectedItem;
  }
  useEffect(() => {
    setShowBar(true);
  }, [currentSelectedItem.current]);

  if (!selectedItem || !showBar) {
    return null;
  }

  // set position of float bar in center chart
  if (floatBarRef.current && defaultCenter) {
    const width = floatBarRef.current.clientWidth;
    setPositionXY({ x: -width / 2, y: 0 });
    setDefaultCenter(false);
  }

  return (
    <DrawFloatBar
      chartId={chartId}
      item={selectedItem}
      positionXY={positionXY}
      floatBarRef={floatBarRef}
      onDrop={onDrop}
      {...actions}
    />
  );
};

export default DrawFloatBarWrapper;
