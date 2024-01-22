import style from './style.module.scss';
import { SVGSearchAltLight, SvgAdd } from '@/assets/images/svg';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { FormControl, InputGroup, Modal } from 'react-bootstrap';
import Loading from '@/components/Loading';
import { Collapse } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import { getSymbolSearchList } from '../fetcher';

const SYMBOL_TYPE = {
  '': 'All',
  crypto: 'Crypto',
  futures: 'Futures',
};

const Item = ({ symbol, handleAddSymbol }) => (
  <div className={style.resultItem} onClick={() => handleAddSymbol(symbol)}>
    <div className={style.symbol}>{symbol.symbol}</div>
    <div className={style.description}>{symbol.description}</div>
    <div className={style.type}>{symbol.type}</div>
    <div className={style.exchange}>{symbol.exchange}</div>
    <div className={style.action}>
      <SvgAdd
        onClick={(e) => {
          e.stopPropagation();
          handleAddSymbol(symbol);
        }}
      />
    </div>
  </div>
);

const ItemLabel = ({ symbol }) => (
  <div className={style.resultItem}>
    <div className={style.symbol}>{symbol.symbol}</div>
    <div className={style.description}>{symbol.description}</div>
    <div className={style.type}>{symbol.type}</div>
    <div className={style.exchange}>{symbol.exchange}</div>
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
  isLoading,
  show,
  currentSymbols,
  closeModal,
  openModal,
  onSelect,
}) => {
  const inputRef = useRef(null);
  const addSymbolRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({ query: '', type: '' });
  const [symbols, setSymbols] = useState([]);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [modalPosition, setModalPosition] = useState({
    top: 0,
    left: 0,
  });
  const [addingSymbols, setAddingSymbols] = useState([]);

  // auto focus search input when open dialog
  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [show]);

  // get symbol search list
  useEffect(() => {
    const query = {
      limit: 50,
      offset: 0,
      query: '',
      type: '',
      exchange: '',
    };
    getSymbolSearchList(query).then((res) => {
      const sortedRes =
        res?.sort((a, b) => (a.symbol > b.symbol ? 1 : -1)) ?? [];
      setSymbols(sortedRes);
      setFilteredSymbols(sortedRes);
    });
  }, []);

  // update modal position
  useEffect(() => {
    if (!show) return;
    const { top, left } = addSymbolRef.current.getBoundingClientRect();
    setModalPosition({ top, left });
    setAddingSymbols([]);
  }, [show]);

  /**
   * filter symbol search list based on query and type
   * @returns {void}
   */
  const handleChangeFilter = useCallback(
    (filter) => {
      if (!isSearching) {
        setIsSearching(true);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const newFilter = { ...currentFilter, ...filter };
        const newFilteredSymbols = symbols.filter(
          (symbol) =>
            symbol.type.toUpperCase().includes(newFilter.type.toUpperCase()) &&
            symbol.full_name
              .toUpperCase()
              .includes(newFilter.query.toUpperCase())
        );
        setCurrentFilter(newFilter);
        setFilteredSymbols(newFilteredSymbols);
        setIsSearching(false);
      }, 400);
    },
    [isSearching, symbols, currentFilter]
  );

  /**
   * handle delete symbol and prevent delete multiple time
   * @param {object} symbol symbol info
   * @returns {void}
   */
  const handleAddSymbol = (symbol) => {
    setAddingSymbols((state) => [...state, symbol.symbol]);
    onSelect(symbol);
  };

  // symbols will be rendered in modal search
  const renderSymbols = useMemo(
    () =>
      filteredSymbols.filter(
        (symbol) =>
          !currentSymbols.includes(symbol.symbol) &&
          !addingSymbols.includes(symbol.symbol)
      ),
    [filteredSymbols, currentSymbols, addingSymbols]
  );

  const itemsFormated = formatItems(renderSymbols);

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
          label: <ItemLabel key={parent.symbol} symbol={parent} />,
          style: {
            border: 'none',
            margin: 0,
            padding: 0,
          },
          children: (
            <>
              {itemsFormated[key].map((item) => (
                <Item
                  handleAddSymbol={handleAddSymbol}
                  key={item.symbol}
                  onClick={onSelect}
                  symbol={item}
                />
              ))}
            </>
          ),
        };
        result.push(item);
      }
    });
    return result;
  }, [itemsFormated, onSelect]);

  return (
    <div ref={addSymbolRef}>
      <button
        className={`btn btn-sm btn-link ${style.buttonAdd}`}
        disabled={isLoading}
        onMouseDown={(e) => {
          // prevent drag and move
          e.stopPropagation();
        }}
        onClick={openModal}
      >
        <SvgAdd />
      </button>

      <Modal
        show={show}
        className={style.symbolSearch}
        contentClassName={style.symbolSearchContent}
        style={{
          top: modalPosition.top,
          left: modalPosition.left,
        }}
        onHide={closeModal}
      >
        <Modal.Header className={style.symbolSearchHeader}>
          <div className={style.symbolSearchTitle}>Add symbol</div>
          <div className={style.symbolSearchField}>
            <InputGroup>
              <FormControl
                autoFocus
                ref={inputRef}
                placeholder="Type to search"
                aria-label="Symbol search"
                className={style.searchInput}
                defaultValue={currentFilter.query}
                onChange={(e) => {
                  handleChangeFilter({ query: e.target.value });
                }}
              />
            </InputGroup>
            <InputGroup.Text className={style.searchIcon}>
              <SVGSearchAltLight />
            </InputGroup.Text>
          </div>
        </Modal.Header>
        <Modal.Body className={style.symbolSearchBody}>
          <div className={style.typeTags}>
            {Object.keys(SYMBOL_TYPE).map((key) => (
              <div
                key={key}
                className={key === currentFilter.type ? style.active : ''}
                onClick={() => {
                  handleChangeFilter({ type: key });
                }}
              >
                {SYMBOL_TYPE[key]}
              </div>
            ))}
          </div>

          <div className={style.resultListWrapper}>
            <div className={style.resultList}>
              <div className={`${style.resultItem} ${style.header}`}>
                <div className={style.symbol}>Symbol</div>
                <div className={style.description}>Description</div>
                <div className={style.type}>Type</div>
                <div className={style.exchange}>Exchange</div>
                <div className={style.action}></div>
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

              {renderSymbols.map((symbol, index) => (
                <div
                  className={style.resultItem}
                  key={index}
                  onClick={() => handleAddSymbol(symbol)}
                >
                  <div className={style.symbol}>{symbol.symbol}</div>
                  <div className={style.description}>{symbol.description}</div>
                  <div className={style.type}>{symbol.type}</div>
                  <div className={style.exchange}>{symbol.exchange}</div>
                  <div className={style.action}>
                    <SvgAdd
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddSymbol(symbol);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {isSearching && (
              <Loading className={style.loading} iconProps={{ width: 50 }} />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SymbolSearch;
