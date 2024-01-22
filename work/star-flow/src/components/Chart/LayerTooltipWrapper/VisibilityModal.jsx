import style from './VisibilityModal.module.scss';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Stack from 'react-bootstrap/Stack';
import { TwoThumbInputRange } from 'react-two-thumb-input-range';
import { actSettingLayer } from '@/redux/actions/setting';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { LAYERS_MAP } from '@/config/consts/layer';

const VisibilityModal = ({ show, setShow, layer, chartId }) => {
  const dispatch = useDispatch();
  const [timeGroup, setTimeGroup] = useState(layer.timeGroup);

  const layerTypeInfo = LAYERS_MAP[layer.type];

  const handleSubmit = () => {
    setShow(false);
    dispatch(actSettingLayer(chartId, layer.i, timeGroup));
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleTimeRange = (e, index) => {
    timeGroup[index].valueMin = e[0];
    timeGroup[index].valueMax = e[1];
    setTimeGroup([...timeGroup]);
  };

  const handleTimeEnable = (e, index) => {
    timeGroup[index].enable = e.target.checked;
    setTimeGroup([...timeGroup]);
  };

  const handleTimeMin = (e, index) => {
    timeGroup[index].valueMin = e.target.value;
    setTimeGroup([...timeGroup]);
  };

  const handleTimeMax = (e, index) => {
    timeGroup[index].valueMax = e.target.value;
    setTimeGroup([...timeGroup]);
  };

  return (
    <Modal show={show} onHide={handleClose} className={`${style.modal}`}>
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Modal.Header className={`${style.modalHeader}`}>
          <Col>
            <Modal.Title>{layerTypeInfo?.name}</Modal.Title>
            <Stack direction="horizontal">
              <ListGroup horizontal>
                <ListGroup.Item action href="#link1">
                  Visibility
                </ListGroup.Item>
              </ListGroup>
            </Stack>
          </Col>
        </Modal.Header>
        <Modal.Body className={`${style.modalBody}`}>
          <Tab.Content className={`${style.content}`}>
            <Tab.Pane eventKey="#link1" className={`${style.item3}`}>
              <div className={`${style.groupTime} `}>
                {timeGroup?.map((item, index) => (
                  <div className={`${style.itemTime}`} key={index}>
                    <div className={`${style.groupChecboxTime}`}>
                      <input
                        type="checkbox"
                        name={item.name}
                        onChange={(e) => handleTimeEnable(e, index)}
                        checked={item.enable}
                      />
                      <label forHTML={item.name}>{item.name}</label>
                    </div>
                    <input
                      type="text"
                      value={item.valueMin}
                      name={item.name}
                      onChange={(e) => handleTimeMin(e, index)}
                    />
                    <TwoThumbInputRange
                      inputStyle={{ width: '160px' }}
                      labelStyle={{ display: 'none' }}
                      step={10}
                      min={item.timeMin}
                      max={item.timeMax}
                      values={[item.valueMin, item.valueMax]}
                      onChange={(e) => handleTimeRange(e, index)}
                    />

                    <input
                      type="text"
                      value={item.valueMax}
                      name={item.name}
                      onChange={(e) => handleTimeMax(e, index)}
                    />
                  </div>
                ))}
              </div>
            </Tab.Pane>
          </Tab.Content>
          {/*  */}
        </Modal.Body>
        <Modal.Footer className={`${style.modalFooter}`}>
          <div>
            <Form.Select
              aria-label="Default select example"
              gap={1}
              className={`${style.formCustom} ${style.position}`}
            >
              <option>Defaults</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
          </div>
          <div className={`${style.buttonGroup}`}>
            <Button
              className={`${style.btnCancel}`}
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className={`${style.btnOK}`}
              variant="primary"
              onClick={handleSubmit}
            >
              OK
            </Button>
          </div>
        </Modal.Footer>
      </Tab.Container>
    </Modal>
  );
};

export default VisibilityModal;
