import { Modal } from 'react-bootstrap';
import BackTestResult from './BackTestResult';

const BackTestResultModal = ({ show, chartId, onHide }) => {
  return (
    <Modal show={show} className="light-modal" size="lg" onHide={onHide}>
      <Modal.Body>
        <BackTestResult chartId={chartId} onHide={onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default BackTestResultModal;
