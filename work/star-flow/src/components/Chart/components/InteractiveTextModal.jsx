import { CustomColorPicker } from '@/components/CustomColorPicker';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Button, FormGroup, FormControl } from 'react-bootstrap';
import { actUpdateDraw } from '@/redux/actions/setting';
import { useDispatch } from 'react-redux';

const InteractiveTextModal = ({
  chartId,
  text,
  showModal,
  onClose,
  onSave,
  container = null,
  drawType,
  drawItems,
  updateDrawsState,
}) => {
  const [currentText, setCurrentText] = useState({ text: '' });
  const inputRef = useRef(null);

  const selectedItem = drawItems.find((item) => item.selected === true);

  const dispatch = useDispatch();

  //luu gia tri goc items vao bien tam
  useEffect(() => {
    if (!showModal) return;
    const oldItems = JSON.parse(JSON.stringify(drawItems));
    dispatch(actUpdateDraw(drawType, { oldItems }, chartId));
  }, [showModal]);

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  const handleChangeText = (e) => {
    setCurrentText({
      ...currentText,
      text: e.target.value,
    });
    if (selectedItem) {
      selectedItem.text = e.target.value;
    }
    updateDrawsState(drawItems);
  };

  const handleSaveText = useCallback(
    (e) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }
      if (onSave) {
        onSave(currentText, chartId);
      }
      return false;
    },
    [currentText, onSave]
  );

  const handleFocus = useCallback(() => {
    if (inputRef.current && inputRef.current.focus) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [inputRef]);

  const handleUpdateField = (fieldName, fieldOpacity, color, opacity) => {
    setCurrentText({
      ...currentText,
      [fieldName]: color,
      [fieldOpacity]: opacity,
    });
    if (selectedItem) {
      selectedItem[fieldName] = color;
      selectedItem[fieldOpacity] = opacity;
    }

    updateDrawsState(drawItems);
  };

  const handleUpdateFontSize = (fieldName, newValue) => {
    if (selectedItem) {
      selectedItem[fieldName] = Math.max(newValue, 10);
    }
    updateDrawsState(drawItems);
  };

  return (
    <div onKeyUp={(e) => e.stopPropagation()}>
      <Modal
        show={showModal}
        onHide={onClose}
        onEntered={handleFocus}
        className="cm-modal"
        container={container}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit text</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSaveText}>
            <input type="submit" hidden />
            <FormGroup className="mb-3 row" controlId="text">
              <label className="form-label col-form-label col-sm-3">Text</label>
              <div className="col-sm-9">
                <FormControl
                  size="sm"
                  ref={inputRef}
                  type="text"
                  value={selectedItem?.text ?? 'Text...'}
                  onChange={handleChangeText}
                />
              </div>
            </FormGroup>
            <div className="mb-3 row align-items-center">
              <label className="form-label col-form-label col-sm-3">
                Font size
              </label>
              <div className="col-sm-9">
                <FormControl
                  size="sm"
                  type="number"
                  value={selectedItem?.fontSize ?? 16}
                  onChange={(e) =>
                    handleUpdateFontSize('fontSize', +e.target.value)
                  }
                />
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="form-label col-form-label col-sm-3">
                Color
              </label>
              <div className="col-sm-9">
                <div className="row">
                  <div className="col-sm-4">
                    <CustomColorPicker
                      fieldName="textFill"
                      label="Text"
                      color={selectedItem?.textFill ?? '#FFFFFF'}
                      opacity={selectedItem?.textOpacity ?? 1}
                      onChange={(fieldName, ...rest) =>
                        handleUpdateField(fieldName, 'textOpacity', ...rest)
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <CustomColorPicker
                      fieldName="fill"
                      label="Bg"
                      color={selectedItem?.fill ?? '#00d5ff'}
                      opacity={selectedItem?.fillOpacity ?? 1}
                      onChange={(fieldName, ...rest) =>
                        handleUpdateField(fieldName, 'fillOpacity', ...rest)
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <CustomColorPicker
                      fieldName="stroke"
                      label="Border"
                      color={selectedItem?.stroke ?? '#00d5ff'}
                      opacity={selectedItem?.strokeOpacity ?? 1}
                      onChange={(fieldName, ...rest) =>
                        handleUpdateField(fieldName, 'strokeOpacity', ...rest)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="text-end mt-2">
            <Button
              bsStyle="primary"
              size="sm"
              className="btn-cm-primary"
              onClick={handleSaveText}
            >
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InteractiveTextModal;
