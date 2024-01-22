import styles from './style.module.scss';

import ScrollWrapper from '../ScrollWrapper';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  Fragment,
  useEffect,
} from 'react';
import { DRAW_TOOLS } from '@/config/consts/drawTool';
import { useDispatch } from 'react-redux';
import { actStartDraw } from '@/redux/actions/setting';

const filterList = (filters) => {
  let result = DRAW_TOOLS;

  result = {};
  for (const key in DRAW_TOOLS) {
    const tool = DRAW_TOOLS[key];
    if (tool.hide !== true) {
      result[key] = tool;
    }
  }

  if (!filters.search) {
    return result;
  }

  if (filters.search) {
    const input = result;
    result = {};
    for (const key in input) {
      const item = input[key];
      const searchValue = filters.search.toLowerCase();
      const name = item.name.toLowerCase();
      const isMatch =
        name.includes(searchValue) ||
        searchValue.includes(name) ||
        searchValue.includes(key) ||
        key.includes(searchValue);
      if (isMatch) {
        result[key] = item;
      }
    }
  }

  return result;
};

const DrawToolList = ({
  chartId,
  symbol,
  className,
  chartDemension,
  ...props
}) => {
  const wrapperRef = useRef(null);
  const listDrawRef = useRef(null);
  const dispatch = useDispatch();
  // filter
  const [currentFilter, setCurrentFilter] = useState({});
  const [showDrawList, setShowDrawList] = useState(false);
  const [activeTypeTool, setactiveTypeTool] = useState(null);
  const [divHeightListTool, setDivHeightListTool] = useState(0);

  const onSelectTool = (item) => {
    dispatch(actStartDraw(item.type, chartId, symbol));
    onSelectDrawTool(item);
    document.removeEventListener('mousedown', handleClickOutside);
    setactiveTypeTool(item.type);
  };

  const list = useMemo(
    () =>
      Object.keys(filterList(currentFilter)).map((key) => {
        const tool = DRAW_TOOLS[key];
        return (
          <Fragment key={key}>
            <div className={styles.line}></div>
            <div
              key={key}
              role="button"
              className={`${styles.drawTool} ${
                activeTypeTool === tool.type && styles.activeId
              }`}
              onClick={() => onSelectTool(tool)}
            >
              <span className={styles.iconTool}>{tool.icon}</span>
              <span className={styles.nameTool}>{tool.name}</span>
            </div>
          </Fragment>
        );
      }),
    [onSelectTool, currentFilter]
  );

  const onSelectDrawTool = useCallback(() => {
    setShowDrawList(false);
  }, []);

  const showListTool = () => {
    setShowDrawList(!showDrawList);
    document.addEventListener('mousedown', handleClickOutside);
  };

  const handleClickOutside = useCallback((event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowDrawList(false);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  let heightListTool;
  useEffect(() => {
    setDivHeightListTool(listDrawRef.current?.clientHeight);
  }, [showDrawList]);

  heightListTool =
    chartDemension.height < divHeightListTool
      ? `${chartDemension.height}px`
      : '';
  return (
    <div ref={wrapperRef}>
      {showDrawList && (
        <div
          ref={listDrawRef}
          {...props}
          className={`${styles.drawToolList} ${className}`}
          style={{ height: `${heightListTool}` }}
        >
          <ScrollWrapper>{list}</ScrollWrapper>
        </div>
      )}
      <button
        role="button"
        className={`${styles.tool}`}
        onClick={() => showListTool()}
      >
        {activeTypeTool === null
          ? DRAW_TOOLS.trend_line.icon
          : DRAW_TOOLS[activeTypeTool].icon}
      </button>
    </div>
  );
};

export default DrawToolList;
