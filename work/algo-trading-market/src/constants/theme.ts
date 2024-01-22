import { theme } from 'antd';
import COLORS from './color';
import { Kanit } from '@next/font/google';

const kanit = Kanit({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--kanit-font',
  subsets: ['latin'],
});

export const THEME_APP = {
  token: {
    fontFamily: kanit.style.fontFamily, // it only effects to antd tags
    colorPrimary: COLORS.PRIMARY,
    colorText: COLORS.WHITE,
    colorBgLayout: COLORS.DARK_BLUE,
    colorBgElevated: COLORS.BG_SECONDARY,
    borderRadius: 8,
  },
};

export const THEME_FORM = {
  algorithm: theme.darkAlgorithm,
  token: {
    screenLGMax: 1169,
    screenXL: 1170,
    screenXLMin: 1170,
    borderRadius: 2,
    fontSize: 16,
    colorBorder: 'transparent',
    colorPrimaryBg: COLORS.PRIMARY,
    colorBgContainer: COLORS.MIRAGE,
    colorBgElevated: COLORS.MIRAGE,
    colorBgContainerDisabled: COLORS.MIRAGE,
    colorTextPlaceholder: COLORS.RIVER_BED,
  },
};

export const THEME_TABLE = {
  algorithm: theme.darkAlgorithm,
  token: {
    borderRadius: 0,
    colorTextHeading: COLORS.BLUE_BELL,
    colorBgContainer: COLORS.BG_SECONDARY,
    colorBorderSecondary: COLORS.BLACK,
  },
};
