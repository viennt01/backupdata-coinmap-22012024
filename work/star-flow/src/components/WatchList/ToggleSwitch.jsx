import style from './ToggleSwitch.module.scss';
import { useRef } from 'react';

const ToggleSwitch = (props) => {
  const ref = useRef(null);

  return (
    <div className={style.toggleSwitch}>
      <input ref={ref} type="checkbox" {...props} />
      <label onClick={() => ref.current.click()} />
    </div>
  );
};

export default ToggleSwitch;
