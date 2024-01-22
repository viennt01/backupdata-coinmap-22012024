import { actToggleExportModal } from '@/redux/actions/setting';
import { useCallback, useRef, useState } from 'react';
import { Modal, Button, FormGroup, FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { INTERVAL_TO_MS } from '../utils';
import { Modal as AntModal, Spin } from 'antd';

const ModalExport = ({ chartId, showModal, interval, limit, onSubmit }) => {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [formValues, setFormValues] = useState({
    startTime: null,
    endTime: null,
  });
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFocus = () => {
    if (inputRef.current?.focus) {
      inputRef.current.focus();
    }
  };

  const onClose = useCallback(() => {
    dispatch(actToggleExportModal(chartId));
  }, [dispatch, chartId]);

  const handleChange = (key, value) => {
    setFormValues((state) => ({ ...state, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoadingModal(true);
    if (onSubmit && Object.values(formValues).every((value) => !!value)) {
      await onSubmit(formValues, chartId);
      dispatch(actToggleExportModal(chartId));
    }
    setShowLoadingModal(false);
    return false;
  };

  const maxDate = new Date();
  maxDate.setMinutes(maxDate.getMinutes() - maxDate.getTimezoneOffset());
  const minDate = new Date(
    new Date().getTime() - limit * INTERVAL_TO_MS[interval]
  );
  minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());
  const maxDateInput = new Date(maxDate).toISOString().slice(0, 16);
  const minDateInput = new Date(minDate).toISOString().slice(0, 16);

  return (
    <>
      <Modal
        show={showModal}
        onHide={onClose}
        backdrop="static"
        onEntered={handleFocus}
        className="cm-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Export chart</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <FormGroup className="mb-3 row" controlId="startTime">
              <label className="form-label col-form-label col-sm-3">From</label>
              <div className="col-sm-9 text-light">
                <FormControl
                  size="sm"
                  ref={inputRef}
                  type="datetime-local"
                  min={minDateInput}
                  max={maxDateInput}
                  value={formValues.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>
            </FormGroup>
            <FormGroup className="mb-3 row" controlId="endTime">
              <label className="form-label col-form-label col-sm-3">To</label>
              <div className="col-sm-9">
                <FormControl
                  size="sm"
                  type="datetime-local"
                  min={minDateInput}
                  max={maxDateInput}
                  value={formValues.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
            </FormGroup>
            <div className="text-end my-2">
              <Button
                bsStyle="primary"
                size="sm"
                type="submit"
                className="btn-cm-primary"
              >
                Export
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <AntModal
        open={showLoadingModal}
        centered
        footer={null}
        closable={false}
        style={{ background: 'transparent', textAlign: 'center' }}
        zIndex={10000}
        width="fit-content"
      >
        <Spin />
      </AntModal>
    </>
  );
};

export default ModalExport;
