import styles from './CustomSelect.module.scss';
import { SVGChervletDown } from '@/assets/images/svg';
import { useState, useContext } from 'react';
import Select from 'react-select';
import { ChartSectionContext } from '@/components/ChartSection';

const customStyle = {
  indicatorsContainer: (provided) => ({
    ...provided,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '1px 8px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    minHeight: 28,
    border: 'none',
    cursor: 'pointer',
    background: '#0F1A30',
    boxShadow: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    lineHeight: '20px',
    padding: '0 8px',
  }),
  input: (provided) => ({
    ...provided,
    color: '#C1C6D8',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#C1C6D8',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (provided) => {
    return {
      ...provided,
      background: '#205979',
      borderRadius: 0,
      zIndex: 100,
      margin: 0,
      boxShadow:
        '2px 2px 3px 2px hsl(0deg 0% 0% / 10%), 1px 7px 11px hsl(0deg 0% 0% / 10%)',
      color: '#fff',
      width: 'auto',
      minWidth: '100%',
    };
  },
  MenuList: (provided) => ({ ...provided }),
  option: (provided, { isSelected, isFocused }) => {
    return {
      ...provided,
      background: isSelected
        ? 'transparent'
        : isFocused
        ? '#205979'
        : '#1c2740',
      lineHeight: '18px',
      padding: '5px 12px',
      whiteSpace: 'nowrap',
    };
  },
  menuList: (provided) => {
    return {
      ...provided,
      padding: 0,
    };
  },
};

const components = {
  DropdownIndicator: (props) => {
    const {
      getStyles,
      innerProps: { ref, ...restInnerProps },
    } = props;
    return (
      <div
        {...restInnerProps}
        ref={ref}
        style={getStyles('dropdownIndicator', props)}
      >
        <SVGChervletDown />
      </div>
    );
  },
};

const toOptions = (options) =>
  options.map((value) => ({ value, label: value }));

const CustomSelect = ({
  withBackdrop = false,
  isSearchable = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contextValue = useContext(ChartSectionContext);
  const { sectionRef, isFullScreen } = contextValue ?? {};
  const menuPortalTarget = isFullScreen ? sectionRef?.current : document.body;
  let options = props.options || [];
  if (typeof props?.options?.[0] === 'string') {
    options = toOptions(options);
  }

  let selectedOption = props.value;
  if (selectedOption && typeof selectedOption !== 'object') {
    selectedOption = options.find((option) => option.value === selectedOption);
  }

  return (
    <>
      <Select
        onMenuOpen={() => withBackdrop && setIsOpen(true)}
        onMenuClose={() => withBackdrop && setIsOpen(false)}
        isSearchable={isSearchable}
        components={components}
        styles={{ ...customStyle, ...(props?.customStyle || {}) }}
        {...props}
        options={options}
        value={selectedOption}
        menuPortalTarget={menuPortalTarget}
        menuShouldBlockScroll
      />
      {withBackdrop && isOpen && <div className={styles.backdrop} />}
    </>
  );
};

CustomSelect.propTypes = Select.propTypes;

export default CustomSelect;
