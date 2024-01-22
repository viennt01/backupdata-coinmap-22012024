import { ConfigProvider, theme } from 'antd';
// import { ThemeConfig } from 'antd/es/config-provider/context';

export const DEFAULT_COLOR = {
  primaryBlue: '#31AFFE',
  primaryPink: '#B02BFE',
  inputDarkBg: '#0F1A30',
  inputDarkStroke: '#151424',
  containerBg: '#21233B',
  tableRow: '#17192D',
  tableRowBorder: '#09081A',
};

/** @type {import('antd/es/config-provider/context').ThemeConfig} */
export const DEFAULT_THEME = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: DEFAULT_COLOR.primaryBlue,
    colorBorder: DEFAULT_COLOR.inputDarkStroke,
    colorBgContainer: DEFAULT_COLOR.inputDarkBg,
    fontSize: 16,
    fontSizeLG: 16,
  },
  components: {
    Popover: {
      colorBgElevated: DEFAULT_COLOR.containerBg,
    },
    Table: {
      colorSplit: DEFAULT_COLOR.tableRowBorder,
      colorBgContainer: DEFAULT_COLOR.tableRow,
    },
    Button: {
      colorPrimary: DEFAULT_COLOR.primaryPink,
    },
    DatePicker: {
      colorBgElevated: DEFAULT_COLOR.containerBg,
      borderRadius: 2,
    },
    Input: {
      borderRadius: 2,
    },
    InputNumber: {
      borderRadius: 2,
    },
    Select: {
      borderRadius: 2,
      borderRadiusLG: 2,
      controlItemBgActive: DEFAULT_COLOR.primaryBlue,
    },
    Checkbox: {
      borderRadius: 2,
      borderRadiusLG: 2,
      borderRadiusSM: 2,
      borderRadiusXS: 2,
    },
  },
};

/**
 * Set Ant theme provider
 *
 * @param {JSX.ElementClass | React.FC} ChildComponent
 * @param {import('antd/es/config-provider/context').ThemeConfig} theme
 * @return {React.FC} New component with theme
 */
const withAntTheme = (ChildComponent, theme) => {
  const WithAntThemeComponent = (props) => {
    return (
      <ConfigProvider theme={theme ?? DEFAULT_THEME}>
        <ChildComponent {...props} />
      </ConfigProvider>
    );
  };

  return WithAntThemeComponent;
};

export default withAntTheme;
