import { SVGSearchAltLight } from '@/assets/images/svg';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Collapse } from 'antd';
import { FormControl, InputGroup, Modal } from 'react-bootstrap';
import { RightOutlined } from '@ant-design/icons';
import Loading from '../Loading';
import styles from './style.module.scss';
import _debounce from 'lodash/debounce';

const symbolTypes = {
  '': 'Tất cả',
  crypto: 'Crypto',
  futures: 'Futures',
};

const Item = ({ item, onClick }) => (
  <div className={styles.resultItem} onClick={() => onClick(item)}>
    <div className={styles.fullname}>{item.full_name}</div>
    <div className={styles.description}>{item.description}</div>
    <div className={styles.type}>{item.type}</div>
    <div className={styles.exchange}>{item.exchange}</div>
  </div>
);

const ItemLabel = ({ item, onClick }) => (
  <div
    className={[styles.resultItem, styles.label].join(' ')}
    onClick={() => onClick(item)}
  >
    <div className={styles.fullname}>{item.full_name}</div>
    <div className={styles.description}>{item.description}</div>
    <div className={styles.type}>{item.type}</div>
    <div className={styles.exchange}>{item.exchange}</div>
  </div>
);

const formatItems = (items) => {
  const result = {
    noAsset: [],
  };
  items.forEach((item) => {
    if (item.groupAsset) {
      result[item.asset] = (result[item.asset] || []).concat([item]);
    } else {
      result['noAsset'].push(item);
    }
  });
  return result;
};

const SymbolSearch = ({
  show,
  handleClose,
  onSelect,
  currentFilter = {},
  items = [],
  onChange,
  isSearching,
  modalContainer,
}) => {
  const topCoverRef = useRef(null);
  const inputRef = useRef(null);
  const obseverRef = useRef(null);

  useEffect(() => {
    return () => {
      if (obseverRef.current) {
        obseverRef.current.disconnect();
        obseverRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [show]);

  const onInputRef = useCallback((ref) => {
    if (!ref) {
      return;
    }
    inputRef.current = ref;
    ref.setSelectionRange(0, ref.value.length);
  }, []);

  const itemsFormated = formatItems(items);

  const itemsCollapse = useMemo(() => {
    const result = [];
    Object.keys(itemsFormated).map((key) => {
      if (key !== 'noAsset') {
        const parent = {
          ...itemsFormated[key][0],
          full_name: key,
        };

        const item = {
          key: key,
          label: (
            <ItemLabel key={parent.symbol} onClick={() => {}} item={parent} />
          ),
          style: {
            border: 'none',
            margin: 0,
            padding: 0,
          },
          children: (
            <>
              {itemsFormated[key].map((item) => (
                <Item key={item.symbol} onClick={onSelect} item={item} />
              ))}
            </>
          ),
        };
        result.push(item);
      }
    });
    return result;
  }, [itemsFormated, onSelect]);

  const onChangeDebounce = useCallback(
    _debounce(
      (e) => {
        const value = e.target.value;
        onChange({
          ...currentFilter,
          query: value,
        });
      },
      [400]
    ),
    []
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="cm-modal"
      size="lg"
      container={modalContainer}
    >
      <Modal.Header closeButton className={styles.header}>
        <Modal.Title className={styles.title}>Symbol search</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-fluid">
        <div>
          <InputGroup>
            <InputGroup.Text className={styles.searchIcon}>
              <SVGSearchAltLight />
            </InputGroup.Text>
            <FormControl
              autoFocus
              ref={onInputRef}
              placeholder="Type to search"
              aria-label="Symbol search"
              className={styles.searchInput}
              defaultValue={currentFilter.query}
              onChange={onChangeDebounce}
            />
          </InputGroup>
        </div>
        <div className={styles.typeTags}>
          {Object.keys(symbolTypes).map((key) => (
            <span
              onClick={() => {
                onChange({
                  ...currentFilter,
                  type: key,
                });
              }}
              key={key}
              className={`${key === currentFilter.type ? styles.active : ''}`}
            >
              {symbolTypes[key]}
            </span>
          ))}
        </div>
        <div className={styles.resultListWrapper}>
          <div className={`${styles.resultList}`}>
            <div ref={topCoverRef}></div>
            <div className={`${styles.resultItem} ${styles.header}`}>
              <div className={styles.fullname}>Symbol</div>
              <div className={styles.description}>Description</div>
              <div className={styles.type}>Type</div>
              <div className={styles.exchange}>Exchange</div>
            </div>

            <Collapse
              items={itemsCollapse}
              bordered={false}
              defaultActiveKey={[itemsCollapse[0]?.key]}
              ghost
              expandIcon={({ isActive }) => (
                <RightOutlined
                  style={{ color: 'white' }}
                  rotate={isActive ? 90 : 0}
                />
              )}
            />
            {Object.keys(itemsFormated).map((key) => {
              if (key === 'noAsset') {
                return itemsFormated['noAsset'].map((item) => (
                  <Item key={item.symbol} onClick={onSelect} item={item} />
                ));
              }
            })}
          </div>
          {isSearching && (
            <Loading className={styles.loading} iconProps={{ width: 50 }} />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SymbolSearch;
