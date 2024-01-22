import styles from './RangeSlider.module.scss';
import { useRef, useEffect } from 'react';
import { Input } from '@/components/ChartSettings/settings/components';

const MIN = 0;
const MAX = 100;
const STEP = 1;

const countPlaces = (number) => {
  const str = number?.toString() ?? '';
  const index = str.indexOf('.');
  return index === -1 ? 0 : str.length - index - 1;
};

const roundNumber = (number, step) => {
  if (!number) return number;
  return Number(number.toFixed(countPlaces(step ?? STEP)));
};

const RangeSlider = ({ value, onChange, ...props }) => {
  const ref = useRef(null);

  useEffect(() => {
    handleChangeBackground(value);
  }, [value]);

  const handleChangeBackground = (value) => {
    const sliderPosition = ((Number(value) - MIN) / (MAX - MIN)) * 100;
    ref.current.style.background =
      `linear-gradient(to right, rgba(101,73,208,0) 0%, rgba(101,73,208,${
        sliderPosition / 100
      }) ` +
      sliderPosition +
      '%, #0F1A30 ' +
      sliderPosition +
      '%, #0F1A30 100%)';
  };

  return (
    <div className={styles.wrapper}>
      <input
        ref={ref}
        className={styles.rangeSlider}
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        {...props}
        value={value || props.min || MIN}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <Input
        type="number"
        style={{
          width: '78px',
          height: '36px',
          boxShadow: 'none',
          color: '#AEAEAE',
          padding: '0 10px',
          fontSize: '16px',
          lineHeight: '4',
        }}
        min={MIN}
        max={MAX}
        step={STEP}
        {...props}
        value={roundNumber(value, props.step)}
        onChange={onChange}
      />
    </div>
  );
};
export default RangeSlider;
