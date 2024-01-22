import { Form } from 'react-bootstrap';
import ConfirmDialog from '../confirmDialog/ConfirmDialog';

import style from './style.module.scss';

const ConfirmCloseDialog = ({
  show,
  onHide,
  onCancel,
  onConfirm,
  handleChangeWarning,
}) => {
  return (
    <ConfirmDialog
      title="CONFIRM"
      show={show}
      onHide={onHide}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <div className={style.confirmContentContainer}>
        <div className={style.confirmContent}>
          All settings of this section will be lost. Do you want to continue?
        </div>
        <div className={style.confirmContentWarning}>
          <Form.Check
            inline
            className={style.checkboxSettings}
            id="dont_show_close_confirm"
            onChange={handleChangeWarning}
            type="checkbox"
          />
          <label htmlFor="dont_show_close_confirm">
            Don&apos;t show this message again.
          </label>
        </div>
      </div>
    </ConfirmDialog>
  );
};

export default ConfirmCloseDialog;
