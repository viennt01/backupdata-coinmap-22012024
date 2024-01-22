import style from './PaneSettings.module.scss';
import { SVGSetting, SVGClose } from '@/assets/images/svg';
import Modal from 'react-bootstrap/Modal';
import { useState, useRef, useEffect, useCallback } from 'react';
import ConfirmDialog from '@/components/confirmDialog/ConfirmDialog';
import ToggleSwitch from './ToggleSwitch';

const CUSTOMIZE_COLUMNS = [
  { name: 'Last', value: 'last' },
  { name: 'Change', value: 'change' },
  { name: 'Change %', value: 'changePercentage' },
  { name: 'Volume', value: 'volume' },
];

const PaneSettings = ({
  isLoading,
  filteredColumns,
  setFilteredColumns,
  handleDeleteAllSymbols,
}) => {
  const [showPaneSettings, setShowPaneSettings] = useState(false);
  const [paneSettingsPosition, setPaneSettingsPosition] = useState({
    top: 0,
    left: 0,
  });
  const settingButtonRef = useRef(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // update pane settings position
  useEffect(() => {
    if (!showPaneSettings) return;
    const { top, left } = settingButtonRef.current.getBoundingClientRect();
    setPaneSettingsPosition({ top, left });
  }, [showPaneSettings]);

  /**
   * hide/display column when on/of filtering
   * @param {string} keyName column key value
   * @returns {void}
   */
  const toggleColumn = (keyName) => {
    const newFilteredColumns = { ...filteredColumns };
    newFilteredColumns[keyName] = !newFilteredColumns[keyName];
    setFilteredColumns(newFilteredColumns);
  };

  const hideConfirmDialog = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  /**
   * clear watch list and close pane settings
   * @returns {void}
   */
  const clearWatchList = () => {
    handleDeleteAllSymbols();
    setShowPaneSettings(false);
    hideConfirmDialog();
  };

  return (
    <div ref={settingButtonRef}>
      <button
        className={`btn btn-sm btn-link ${style.buttonSettings}`}
        disabled={isLoading}
        onMouseDown={(e) => {
          // prevent drag and move
          e.stopPropagation();
        }}
        onClick={() => setShowPaneSettings(true)}
      >
        <SVGSetting />
      </button>

      <Modal
        show={showPaneSettings}
        style={{
          top: paneSettingsPosition.top,
          left: paneSettingsPosition.left,
        }}
        className={style.paneSettings}
        contentClassName={style.menuWrapper}
        onHide={() => setShowPaneSettings(false)}
      >
        <Modal.Body className={style.menu}>
          <div className={style.section}>
            <div
              className={`${style.sectionItem} ${style.hover}`}
              onClick={() => setShowConfirmDialog(true)}
            >
              <div className={style.sectionItemButton}>
                <SVGClose width={16} height={16} /> Clear list
              </div>
            </div>
          </div>
          <div className={style.section}>
            <div className={style.sectionTitle}>Customize columns</div>
            {CUSTOMIZE_COLUMNS.map((column, index) => (
              <div className={style.sectionItem} key={index}>
                <div>{column.name}</div>
                <ToggleSwitch
                  defaultChecked={filteredColumns[column.value]}
                  onChange={() => toggleColumn(column.value)}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmDialog
        title="CLEAR LIST"
        show={showConfirmDialog}
        onHide={hideConfirmDialog}
        onCancel={hideConfirmDialog}
        onConfirm={clearWatchList}
      >
        <div style={{ textAlign: 'center' }}>
          Do you want to clear all symbols?
        </div>
      </ConfirmDialog>
    </div>
  );
};

export default PaneSettings;
