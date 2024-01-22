import style from './ToggleSwitch.module.scss';
import { useRef } from 'react';

const ToggleSwitch = ({ label, ...props }) => {
  const ref = useRef(null);

  return (
    <div className={style.toggleSwitch}>
      <div>
        <input ref={ref} type="checkbox" {...props} />
        <label onClick={() => ref.current.click()} />
      </div>
      {label}
    </div>
  );
};

export default ToggleSwitch;
