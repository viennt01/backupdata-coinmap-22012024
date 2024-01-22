import { useState } from 'react';
import Icons from '@/components/HomePage/components/Icons';
import style from './Dropdown.module.scss';
const DropDown = ({
  title,
  itemList,
  showIcon = true,
  onClick,
  touchOpen, // is mobile version
  size = 'medium',
}) => {
  const [state, setState] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (touchOpen) {
      setState(!state);
    }
  };

  const sizeStyle =
    size === 'small' ? 'text-body-6' : 'text-[16px] leading-[17px] font-medium';

  return (
    <div className={`${style.container}  ${sizeStyle}`}>
      <div
        onClick={handleClick}
        className={`${touchOpen ? style.px__12 : style.px__16} ${style.box}`}
      >
        <span className={style.span}>{title}</span>
        {showIcon &&
          (state ? (
            <Icons name={Icons.names.arrowTop} />
          ) : (
            <Icons name={Icons.names.arrowDown} />
          ))}
      </div>
      {itemList && itemList.length > 0 && (
        <ul
          className={[
            style.ulGroup,
            touchOpen
              ? `${style.add__1} ${state ? style.add__2 : style.add__3}`
              : style.add__4,
          ].join(' ')}
        >
          {itemList.map((i) => (
            <li
              key={i.label}
              onClick={i.onClick}
              className={`${style.add__5} ${
                touchOpen ? style.px__12 : style.px__16
              } ${style.add__6}`}
            >
              {i.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
