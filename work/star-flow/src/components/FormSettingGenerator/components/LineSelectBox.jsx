import { LINE_TYPES } from '@/config/consts/layer';
import CustomSelect from './CustomSelect';

import styles from './LineSelectBox.module.scss';

const renderLineOptionLabel = (option) => {
  return (
    <div className={styles.lineContainer}>
      <div
        className={`${styles.line} ${styles[option.value.toLocaleLowerCase()]}`}
      ></div>
    </div>
  );
};

export const LineSelectBox = (props) => {
  return (
    <CustomSelect
      isSearchable={false}
      options={LINE_TYPES}
      formatOptionLabel={renderLineOptionLabel}
      {...props}
    />
  );
};
