import styles from './LineSize.module.scss';
import CustomSelect from './CustomSelect';
import { LINE_SIZES } from '@/config/consts/layer';

const renderLineSizeOptionLabel = (option) => {
  return (
    <div className={styles.lineOption}>
      <div className={styles.lineShapeWrapper}>
        <div
          className={`${styles.lineShape} ${styles['size' + option.value]}`}
        ></div>
      </div>
      <div>{option.value + ' px'}</div>
    </div>
  );
};

const LineSize = (props) => {
  return (
    <CustomSelect
      isSearchable={false}
      hideDropdownIndicator
      formatOptionLabel={renderLineSizeOptionLabel}
      options={LINE_SIZES.map((option) => ({
        label: option.toString(),
        value: option,
      }))}
      {...props}
    />
  );
};

export default LineSize;
