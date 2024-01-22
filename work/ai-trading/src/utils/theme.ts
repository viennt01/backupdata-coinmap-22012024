import { AppTheme } from '@/components/layout/interface';
import COLORS from '@/constants/color';
import { Montserrat } from '@next/font/google';
import { theme as antdTheme } from 'antd';

export const appFont = Montserrat({
  variable: '--montserrat-font',
  subsets: ['latin', 'vietnamese'],
});

export const getThemeApp = (theme: AppTheme) => {
  return {
    token: {
      fontFamily: appFont.style.fontFamily, // it only effects to antd tags
      colorPrimary: theme.colors.primary,
      colorText: COLORS.WHITE,
      colorBgLayout: theme.colors.secondary_darken_2,
      colorBgElevated: theme.colors.secondary_darken_1,
      borderRadius: 8,
    },
  };
};

export const getThemeForm = (theme: AppTheme) => {
  return {
    algorithm: antdTheme.darkAlgorithm,
    token: {
      screenLGMax: 1169,
      screenXL: 1170,
      screenXLMin: 1170,
      borderRadius: 2,
      fontSize: 16,
      colorTextHeading: theme.colors.on_secondary_darken_2,
      colorText: theme.colors.on_secondary_darken_1,
      colorBorder: 'transparent',
      colorPrimaryBg: theme.colors.primary,
      colorBgContainer: theme.colors.secondary_darken_1,
      colorBgElevated: theme.colors.secondary_darken_1,
      colorBgContainerDisabled: theme.colors.secondary_darken_1,
      colorTextPlaceholder: theme.colors.secondary_lighten_1,
      colorFillAlter: theme.colors.secondary_darken_2,
    },
  };
};

export const getThemeTable = (theme: AppTheme) => {
  return {
    algorithm: antdTheme.darkAlgorithm,
    token: {
      borderRadius: 0,
      colorText: theme.colors.on_secondary_darken_1,
      colorTextHeading: theme.colors.on_secondary_darken_1,
      colorBgContainer: theme.colors.secondary_darken_1,
      colorBorderSecondary: theme.colors.secondary_darken_2,
    },
  };
};

export const setColorToRoot = (colors: { [key: string]: string }) => {
  Object.keys(colors).forEach((key) => {
    document.documentElement.style.setProperty(`--${key}`, colors[key]);
  });
};
