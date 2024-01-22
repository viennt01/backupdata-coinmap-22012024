import { SVGSearchAltLight } from '@/assets/images/svg';
import {
  HEATMAP_INDICATOR_TYPES,
  INDICATOR_TYPES,
} from '@/config/consts/layer';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormControl, InputGroup, Modal } from 'react-bootstrap';
import styles from './style.module.scss';

const indicatorTypes = {
  '': 'Tất cả',
  premium: 'Premium',
  free: 'Free',
};

const layersMap = {};
INDICATOR_TYPES.forEach((item) => {
  layersMap[item.id] = item;
});

const heatmapIndicatorsMap = {};
HEATMAP_INDICATOR_TYPES.forEach((item) => {
  heatmapIndicatorsMap[item.id] = item;
});

const filterIndicators = (filters, indicatorsMap) => {
  if (!filters.type && !filters.search) {
    return indicatorsMap;
  }
  let result = {};
  if (filters.type) {
    for (const key in indicatorsMap) {
      const item = indicatorsMap[key];
      if (item.type === filters.type) {
        result[key] = item;
      }
    }
  } else {
    result = indicatorsMap;
  }
  if (filters.search) {
    const input = result;
    result = {};
    for (const key in input) {
      const item = input[key];
      const searchValue = filters.search.toLowerCase();
      const fullName = item.fullName.toLowerCase();
      const isMatch =
        fullName.includes(searchValue) ||
        searchValue.includes(fullName) ||
        searchValue.includes(key) ||
        key.includes(searchValue);
      if (isMatch) {
        result[key] = item;
      }
    }
  }

  return result;
};

const Item = ({ item, onClick, disabled }) => {
  let className = styles.resultItem;
  if (disabled) {
    className += ` ${styles.disabled}`;
  }

  return (
    <div className={className} onClick={onClick}>
      <div className={styles.fullname}>{item.fullName}</div>
      {/* <div className={styles.type}>{item.type}</div> */}
    </div>
  );
};

const AddLayerModal = ({ show, onHide, onSelect, container, isHeatmap }) => {
  const [showTopCover, setShowTopCover] = useState(false);
  const [showBottomCover, setShowBottomCover] = useState(false);

  const resultListRef = useRef(null);
  const topCoverRef = useRef(null);
  const bottomCoverRef = useRef(null);
  const inputRef = useRef(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
  });

  // get indicators list and sort based on full name
  const indicators = useMemo(() => {
    const indicatorsMap = isHeatmap ? heatmapIndicatorsMap : layersMap;
    return Object.keys(indicatorsMap)
      .sort((aKey, bKey) =>
        indicatorsMap[aKey].fullName > indicatorsMap[bKey].fullName ? 1 : -1
      )
      .reduce((obj, key) => {
        obj[key] = indicatorsMap[key];
        return obj;
      }, {});
  }, [isHeatmap]);

  const itemEls = useMemo(() => {
    const itemsMap = filterIndicators(filters, indicators);
    return Object.keys(itemsMap).map((key) => {
      const item = itemsMap[key];
      return <Item key={key} onClick={() => onSelect(key)} item={item} />;
    });
  }, [filters, onSelect, indicators]);

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

  const handleChangeFilter = useCallback(
    (key, value) => {
      if (filters[key] === value) {
        return;
      }
      setFilters({
        ...filters,
        [key]: value,
      });
    },
    [setFilters, filters]
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
  }, [resultListRef.current, handleIntersect]);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [show]);

  return (
    <Modal
      container={container}
      show={show}
      onHide={onHide}
      className="cm-modal"
      size="md"
      contentClassName={styles.modalContent}
      enforceFocus={false} // if container is sectionRef, need to set enforceFocus = false. because it leads to dropdown menu of react-select cannot open
    >
      <Modal.Header closeButton className={styles.header}>
        <Modal.Title className={styles.title}>Indicators search</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-fluid">
        <div>
          <InputGroup>
            <InputGroup.Text className="cm-search-icon">
              <SVGSearchAltLight />
            </InputGroup.Text>
            <FormControl
              autoFocus
              ref={inputRef}
              placeholder="Type to search"
              aria-label="Symbol search"
              className="cm-search-input"
              defaultValue={filters.search}
              onChange={(e) => {
                handleChangeFilter('search', e.target.value);
              }}
            />
          </InputGroup>
        </div>
        {/* <div className={styles.typeTags}>{typeTags}</div> */}
        <div className={styles.resultListWrapper}>
          <div
            className={`${styles.resultList} ${
              showTopCover ? styles.hasTopCover : ''
            } ${showBottomCover ? styles.hasBottomCover : ''}`}
            ref={resultListRef}
          >
            <div ref={topCoverRef}></div>
            <div className={`${styles.resultItem} ${styles.header}`}>
              <div className={styles.fullname}>Name</div>
              {/* <div className={styles.type}>Type</div> */}
            </div>
            {itemEls}
            <div ref={bottomCoverRef}></div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default memo(AddLayerModal);
