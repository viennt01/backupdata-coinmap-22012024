import { actToggleJumpToModal } from '@/redux/actions/setting';
import { useCallback, useRef, useState } from 'react';
import { Modal, Button, FormGroup, FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

const ModalJumpTo = ({ chartId, showModal, onSubmit }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(actToggleJumpToModal(chartId));
  }, [dispatch, chartId]);

  const handleChange = useCallback(
    (e) => {
      setSelectedTime(e.target.value);
    },
    [setSelectedTime]
  );

  const handleSubmit = useCallback(
    (e) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }
      if (onSubmit) {
        onSubmit(selectedTime, chartId);
      }
      return false;
    },
    [selectedTime, onSubmit, chartId]
  );

  const handleFocus = useCallback(() => {
    if (inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      backdrop="static"
      onEntered={handleFocus}
      className="cm-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Jump to</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <FormGroup className="mb-3 row" controlId="text">
            <label className="form-label col-form-label col-sm-3">Time</label>
            <div className="col-sm-9">
              <FormControl
                size="sm"
                ref={inputRef}
                type="datetime-local"
                value={selectedTime}
                onChange={handleChange}
              />
            </div>
          </FormGroup>
          <div className="text-end mt-2">
            <Button
              bsStyle="primary"
              size="sm"
              type="submit"
              className="btn-cm-primary"
            >
              Jump
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalJumpTo;
