import { useEffect, useState } from 'react';
import styled from './styles.module.scss';
import { LINE_TYPE } from '@/config/consts/settings/view';

export const LINES_OPTIONS = [
  {
    label: 'Line',
    value: LINE_TYPE.LINE,
  },
  {
    label: 'Dash line',
    value: LINE_TYPE.DASH_LINE,
  },
  {
    label: 'Dot',
    value: LINE_TYPE.DOT_LINE,
  },
];

const LineType = ({ lineType = 'line' }) => {
  switch (lineType) {
    case LINE_TYPE.LINE: {
      return <div className={[styled.line, styled.lineType].join(' ')}></div>;
    }
    case LINE_TYPE.DASH_LINE: {
      return <div className={[styled.dash, styled.lineType].join(' ')}></div>;
    }
    case LINE_TYPE.DOT_LINE: {
      return <div className={[styled.dot, styled.lineType].join(' ')}></div>;
    }
    default: {
      return null;
    }
  }
};

const SingleLine = ({ text, lineType, selectLine }) => {
  return (
    <div
      onClick={() => selectLine({ label: text, value: lineType })}
      className={[
        styled.singleSelectLineContainer,
        styled.singleSelectLineHover,
      ].join(' ')}
    >
      <span className="text">{text}</span>
      <LineType lineType={lineType} />
      <svg
        width="15"
        height="9"
        viewBox="0 0 15 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    </div>
  );
};

export default function SelectLines({ line, selectLine, key, disabled }) {
  const [toggleDropdown, setToogleDropdown] = useState(false);
  const id = `select-line-dropdown-${key}`;

  useEffect(() => {
    const container = document.getElementById('table-settings-view');
    const ignoreClickOnMeElement = document.getElementById(id);
    function handleClickOutside(event) {
      const isClickInsideElement = ignoreClickOnMeElement.contains(
        event.target
      );
      if (!isClickInsideElement) {
        setToogleDropdown(false);
      }
    }
    container.addEventListener('click', handleClickOutside, false);
    return () => {
      container.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const handleSelect = (line) => {
    setToogleDropdown(false);
    if (selectLine) {
      selectLine(line);
    }
  };

  return (
    <div id={id} className={styled.selectLineContainer}>
      {toggleDropdown && (
        <div
          onClick={() => setToogleDropdown((prev) => !prev)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        ></div>
      )}

      <div
        onClick={() => !disabled && setToogleDropdown((prev) => !prev)}
        className={styled.singleSelectLineContainer}
      >
        <span className="text">{line.label}</span>
        <LineType lineType={line.value} />
        <svg
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.917 1L7.41699 7.5L0.916993 0.999999"
            stroke="#D9D9D9"
            strokeWidth="1.25"
          />
          <path
            d="M13.917 1L7.41699 7.5L0.916993 0.999999"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="1.25"
          />
        </svg>
      </div>

      <div
        className={[
          styled.dropdownSelectLineContainer,
          toggleDropdown
            ? styled.dropdownSelectLineContainerOpen
            : styled.dropdownSelectLineContainerClose,
        ].join(' ')}
      >
        {LINES_OPTIONS.map((l) => {
          return (
            <SingleLine
              text={l.label}
              lineType={l.value}
              selectLine={handleSelect}
              key={l.value}
            />
          );
        })}
      </div>
    </div>
  );
}
