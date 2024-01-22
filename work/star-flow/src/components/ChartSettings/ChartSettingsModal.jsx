import { createContext, useMemo, useRef, useState } from 'react';
import { Modal, Dropdown } from 'react-bootstrap';
import Draggable from 'react-draggable';

import SettingMenu from './SettingMenu';
import ThemeSettings from './settings/Theme/Theme';
import FootprintSettings from './settings/Footprint/Footprint';

import styles from './styles.module.scss';
import ViewSettings from './settings/View/View';
import StatusLineSettings from './settings/StatusLine/StatusLine';
import TimeScaleSettings from './settings/TimeScale/TimeScale';
import PriceScaleSettings from './settings/PriceScale/PriceScale';

const MENU = {
  // general: {
  //   name: 'General',
  //   component: () => <GeneralSettings />,
  //   icon: SvgSetting,
  // },
  view: {
    name: 'View',
    component: (props = {}) => <ViewSettings {...props} />,
  },
  statusLine: {
    name: 'Status Line',
    component: (props = {}) => <StatusLineSettings {...props} />,
  },
  timeScale: {
    name: 'Time Scale',
    component: (props = {}) => <TimeScaleSettings {...props} />,
  },
  priceScale: {
    name: 'Price Scale',
    component: (props = {}) => <PriceScaleSettings {...props} />,
  },
  footPrint: {
    name: 'Footprint',
    component: (props = {}) => <FootprintSettings {...props} />,
  },
  theme: {
    name: 'Theme',
    component: (props = {}) => <ThemeSettings {...props} />,
  },
};

const CustomDialog = ({ children }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const refDragable = useRef(null);

  const dialog = useMemo(
    () => (
      <Modal.Dialog
        contentClassName={`${styles.content} ${
          fullscreen ? styles.fullscreen : ''
        }`}
        size="lg"
        fullscreen={fullscreen}
        className={styles.dialog}
      >
        <Modal.Header
          className={styles.header}
          onDoubleClick={() => {
            if (refDragable && refDragable.current) {
              refDragable.current.setState({ x: 0, y: 0 }, () => {
                setFullscreen(!fullscreen);
              });
            } else {
              setFullscreen(!fullscreen);
            }
          }}
          closeButton
          id="chartSettingDragable"
        ></Modal.Header>

        {children}
      </Modal.Dialog>
    ),
    [children, fullscreen]
  );

  return (
    <Draggable handle="#chartSettingDragable" ref={refDragable}>
      {dialog}
    </Draggable>
  );
};

export const SettingContext = createContext({
  chartId: '',
});

const ChartSettingsModal = ({ show, handleClose, chartId, chartStore }) => {
  const [activeSettingsKey, setActiveSettingsKey] = useState('view');

  const settingsComponent = useMemo(
    () =>
      MENU[activeSettingsKey].component({ chartId, handleClose, chartStore }),
    [activeSettingsKey, chartId, handleClose, chartStore]
  );

  const commonProps = useMemo(() => ({ chartId }), [chartId]);

  return (
    <Modal
      dialogAs={CustomDialog}
      show={show}
      onHide={() => {
        const saved = false;
        const isFootprintActiveSettingsKey = activeSettingsKey === 'footPrint';
        handleClose(saved, isFootprintActiveSettingsKey);
      }}
      className={styles.modal}
      animation={false}
    >
      <Modal.Body className={styles.body}>
        <SettingContext.Provider value={commonProps}>
          <div className={styles.menuWrapper}>
            <div className={[styles.title, styles.menuItem].join(' ')}>
              Chart Settings
            </div>
            <Dropdown.Divider />
            <SettingMenu
              menu={MENU}
              activeKey={activeSettingsKey}
              onClick={(key) => setActiveSettingsKey(key)}
            />
          </div>
          <div className={styles.detailSettingsWrapper}>
            <div className={styles.detailSettings}>{settingsComponent}</div>
          </div>
        </SettingContext.Provider>
      </Modal.Body>
    </Modal>
  );
};

export default ChartSettingsModal;
