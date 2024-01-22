import React from "react";
import PropTypes from "prop-types";
import {
  SvgInfo,
  SvgEyeOpen,
  SvgEyeClose,
  SvgSetting,
  SvgChevronDown,
  SvgChevronUp,
  SvgClose,
} from "./SvgIcon";

const LayerTooltipItem = ({
  show,
  disabled,
  disabledSetting,
  infoMessage,
  content,
  onClickView,
  onClickSetting,
  onClickMoveDown,
  onClickMoveUp,
  onClickDelete,
}) => {
  return (
    <>
      <div
        className={`layerTooltipItem ${disabled ? "disabledText" : ""}`}
        tabIndex={0}
      >
        <div className="layerContent">{content}</div>
        {disabled && (
          <div className="tooltipWrapper">
            <div className="tooltipTrigger">
              <button className="layerButton buttonInfo">
                <SvgInfo width={18} height={18} />
              </button>
            </div>
            <span className="tooltipMessage">{infoMessage}</span>
          </div>
        )}
        <button className="layerButton" onClick={onClickView}>
          {show ? (
            <SvgEyeOpen height={24} width={24} />
          ) : (
            <SvgEyeClose height={16} width={16} />
          )}
        </button>
        <div className="hiddenButtons">
          <button
            className={`layerButton ${disabledSetting ? "disabledButton" : ""}`}
            onClick={disabledSetting ? null : onClickSetting}
          >
            <SvgSetting height={16} width={16} />
          </button>
          <button className="layerButton" onClick={onClickMoveDown}>
            <SvgChevronDown height={16} width={16} />
          </button>
          <button className="layerButton" onClick={onClickMoveUp}>
            <SvgChevronUp height={16} width={16} />
          </button>
          <button className="layerButton" onClick={onClickDelete}>
            <SvgClose height={12} width={12} />
          </button>
        </div>
      </div>
      <style jsx>{`
        .layerTooltipItem {
          width: fit-content;
          height: 22px;
          display: flex;
          color: white;
          font-size: 12px;
          border-radius: 2px;
          border: 1px solid rgba(0, 0, 0, 0.3);
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(3px);
        }

        .layerTooltipItem .layerContent {
          display: flex;
          align-items: center;
          flex-wrap: no-wrap;
          gap: 4px;
          padding: 0 4px;
          white-space: nowrap;
        }

        .layerTooltipItem .layerButton {
          color: #858d9a;
          width: 20px;
          height: 20px;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .layerTooltipItem .layerButton:hover {
          background: rgba(37, 43, 65, 0.6);
        }
        .layerTooltipItem .layerButton.buttonInfo {
          background: transparent !important;
        }
        .layerTooltipItem .layerButton.disabledButton {
          color: #3e3e3e;
        }

        .layerTooltipItem .hiddenButtons {
          width: 0;
          display: flex;
          align-items: center;
          flex-wrap: no-wrap;
          overflow: hidden;
          transition: all ease-out 0.1s;
        }

        .layerTooltipItem:hover,
        .layerTooltipItem:focus {
          border: 1px solid rgba(238, 238, 238, 0.3);
        }
        .layerTooltipItem:hover .hiddenButtons,
        .layerTooltipItem:focus .hiddenButtons {
          width: 80px;
        }

        .layerTooltipItem.disabledText {
          color: #5e5e5e;
        }

        .tooltipWrapper {
          position: relative;
        }
        .tooltipWrapper .tooltipMessage {
          display: none;
          position: absolute;
          top: 50%;
          left: calc(100% + 4px);
          transform: translateY(-50%);
          width: fit-content;
          white-space: nowrap;
          max-width: 280px;
          text-align: center;
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          background: black;
          box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
            rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
        }
        .tooltipWrapper .tooltipMessage::before {
          content: "";
          display: block;
          position: absolute;
          top: 50%;
          right: 100%;
          width: 0;
          height: 0;
          transform: translateY(-50%);
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-right: 4px solid black;
        }
        .tooltipWrapper .tooltipTrigger:hover ~ .tooltipMessage {
          display: block;
        }
      `}</style>
    </>
  );
};

// eslint-disable-next-line const-immutable/no-mutation
LayerTooltipItem.propTypes = {
  show: PropTypes.bool, // show or hidden indicator in chart
  disabled: PropTypes.bool, // using to disable indicator
  disabledSetting: PropTypes.bool, // using to disable setting button
  infoMessage: PropTypes.string, // info message tooltip
  content: PropTypes.object, // content of indicator
  onClickView: PropTypes.func, // click event of view button
  onClickSetting: PropTypes.func, // click event of setting button
  onClickMoveDown: PropTypes.func, // click event move down button
  onClickMoveUp: PropTypes.func, // click event of move up button
  onClickDelete: PropTypes.func, // click event of delete button
};

// eslint-disable-next-line const-immutable/no-mutation
LayerTooltipItem.defaultProps = {
  show: true,
  disabled: false,
  disabledSetting: false,
  infoMessage: "Please upgrade to use this function",
  content: {},
  onClickView: () => null,
  onClickSetting: () => null,
  onClickMoveDown: () => null,
  onClickMoveUp: () => null,
  onClickDelete: () => null,
};

export default LayerTooltipItem;
