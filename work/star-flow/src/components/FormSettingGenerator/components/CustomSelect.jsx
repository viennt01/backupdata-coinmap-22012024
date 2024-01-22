import styles from './CustomSelect.module.scss';
import { SVGChervletDown } from '@/assets/images/svg';
import { useState, useContext } from 'react';
import Select from 'react-select';
import { ChartSectionContext } from '@/components/ChartSection';

const customStyle = {
  indicatorsContainer: (provided) => ({
    ...provided,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: '0',
    marginRight: '8px',
    color: '#AEAEAE',
    transition: 'all .2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  control: (provided, { isDisabled }) => ({
    ...provided,
    borderRadius: 4,
    minHeight: 36,
    border: 'none',
    cursor: 'pointer',
    background: '#0F1A30',
    boxShadow: 'none',
    opacity: isDisabled ? 0.55 : 1,
  }),
  valueContainer: (provided) => ({
    ...provided,
    lineHeight: '20px',
    padding: '0 8px',
  }),
  input: (provided) => ({
    ...provided,
    color: '#AEAEAE',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#AEAEAE',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#AEAEAE',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (provided) => {
    return {
      ...provided,
      background: '#0F1A30',
      borderRadius: 0,
      zIndex: 100,
      margin: 0,
      borderRadius: 4,
      padding: 2,
      boxShadow:
        '2px 2px 3px 2px hsl(0deg 0% 0% / 10%), 1px 7px 11px hsl(0deg 0% 0% / 10%)',
      color: '#AEAEAE',
      with: '100%',
      minWidth: '84px',
      fontSize: '16px',
    };
  },
  MenuList: (provided) => ({ ...provided }),
  option: (provided, { isSelected, isFocused }) => {
    return {
      ...provided,
      background: isSelected ? '#14C8D8' : isFocused ? '#263048' : '#0F1A30',
      lineHeight: '36px',
      padding: '0 10px',
      whiteSpace: 'nowrap',
      color: isSelected ? '#fff' : '#AEAEAE',
      minHeight: '36px',
      borderRadius: 4,
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
  hideDropdownIndicator = false,
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
        components={
          hideDropdownIndicator
            ? { DropdownIndicator: () => null }
            : { ...components }
        }
        styles={{ ...customStyle, ...(props?.customStyle || {}) }}
        {...props}
        options={options}
        value={selectedOption}
        menuPortalTarget={menuPortalTarget}
        menuShouldBlockScroll
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary: '#263048',
            primary75: '#263048',
            primary50: '#263048',
            primary25: '#263048',
          },
        })}
      />
      {withBackdrop && isOpen && <div className={styles.backdrop} />}
    </>
  );
};

CustomSelect.propTypes = Select.propTypes;

export default CustomSelect;
