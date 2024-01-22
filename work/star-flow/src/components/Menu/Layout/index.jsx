import { useCallback, useState, useRef, Fragment } from 'react';
import { Nav } from 'react-bootstrap';
import SvgTemplate from '@/assets/images/svg/template.svg';
import {
  SvgLayout1,
  SvgLayout2_1,
  SvgLayout2_2,
  SvgLayout3_1,
  SvgLayout3_2,
  SvgLayout3_3,
  SvgLayout3_4,
  SvgLayout3_5,
  SvgLayout3_6,
  SvgLayout4_1,
  SvgLayout4_2,
  SvgLayout4_3,
  SvgLayout4_4,
  SvgLayout4_5,
  SvgLayout4_6,
} from '@/assets/images/svg';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { layoutsConfig } from '@/config/consts/configFormatLayout';
import { actSetLayout } from '@/redux/actions/setting';

const Layout = () => {
  const charts = useSelector((state) => state.chartSettings.charts);
  const [isShowLayoutFormat, setIsShowLayoutFormat] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);

  const showPanels = () => {
    setIsShowLayoutFormat(true);
    document.addEventListener('mousedown', handleClickOutside);
  };

  const saveLayout = useCallback(
    (newLayout) => {
      newLayout.map((layout) => dispatch(actSetLayout(layout, layout.i)));
    },
    [dispatch, charts]
  );

  const handleClickOutside = useCallback((event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsShowLayoutFormat(false);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleChangeLayout = (layoutId) => {
    setActiveId(layoutId);
    document.removeEventListener('mousedown', handleClickOutside);
    saveLayout(layoutsConfig(charts, layoutId));
    setIsShowLayoutFormat(false);
  };

  const configIcon = [
    [{ id: 1, icon: <SvgLayout1 /> }],
    [
      { id: 2, icon: <SvgLayout2_1 /> },
      { id: 3, icon: <SvgLayout2_2 /> },
    ],
    [
      { id: 4, icon: <SvgLayout3_1 /> },
      { id: 5, icon: <SvgLayout3_2 /> },
      { id: 6, icon: <SvgLayout3_3 /> },
      { id: 7, icon: <SvgLayout3_4 /> },
      { id: 8, icon: <SvgLayout3_5 /> },
      { id: 9, icon: <SvgLayout3_6 /> },
    ],
    [
      { id: 10, icon: <SvgLayout4_1 /> },
      { id: 11, icon: <SvgLayout4_2 /> },
      { id: 12, icon: <SvgLayout4_3 /> },
      { id: 13, icon: <SvgLayout4_4 /> },
      { id: 14, icon: <SvgLayout4_5 /> },
      { id: 15, icon: <SvgLayout4_6 /> },
    ],
  ];

  return (
    <Nav.Item as="li" className={style.itemWrapper}>
      <Nav.Link
        href="#"
        // onClick={showInfoIncomming}
        className={`${style.menuItem} `}
        onClick={() => showPanels()}
      >
        <div>
          <SvgTemplate height={20} />
        </div>
        <span>LAYOUT</span>
      </Nav.Link>
      {isShowLayoutFormat && (
        <>
          <div className={style.boxCover}></div>
          <div className={style.showDownPanels} ref={wrapperRef}>
            {configIcon.map((row, index) => (
              <Fragment key={index}>
                <div className={style.rowItem}>
                  {row.map((item) => (
                    <div
                      key={item.id}
                      className={`${style.layoutButtonWrapp} ${
                        activeId === item.id && style.activeId
                      }`}
                      onClick={() => handleChangeLayout(item.id)}
                    >
                      {item.icon}
                    </div>
                  ))}
                </div>
                <div className={style.line}></div>
              </Fragment>
            ))}
          </div>
        </>
      )}
    </Nav.Item>
  );
};

export default Layout;
