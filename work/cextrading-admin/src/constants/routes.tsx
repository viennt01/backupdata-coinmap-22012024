import {
  HomeIcon,
  PersonIcon,
  SettingsIcon,
  DocumentIcon,
  BotIcon,
} from 'components/icons/icons';
import React from 'react';
import { PERMISSION_LIST } from './permission-id';

export interface DashRoutes {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  layout?: string;
  redirect?: boolean;
  secondaryNavbar?: boolean;
  category?: string;
  state?: string;
  views?: DashRoutes[];
  link?: string;
  permission?: string[];
}

export type Routes = DashRoutes[];

const dashRoutes: Routes = [
  {
    path: '',
    name: 'Admin',
    link: '/admin',
    icon: <HomeIcon color="inherit" />,
    layout: '/admin',
    permission: [PERMISSION_LIST.GET_ADMIN, PERMISSION_LIST.GET_AUTH_ROLE],
  },
  {
    path: '',
    name: 'User',
    link: '/user',
    icon: <PersonIcon color="inherit" />,
    layout: '/user',
    permission: [
      PERMISSION_LIST.GET_USER,
      PERMISSION_LIST.GET_ROLE,
      PERMISSION_LIST.GET_PACKAGE,
    ],
  },
  {
    path: '',
    name: 'Bot',
    link: '/bot',
    icon: <BotIcon color="inherit" />,
    layout: '/bot',
    permission: [
      PERMISSION_LIST.GET_BOT,
      PERMISSION_LIST.GET_BOT_TRADING,
      PERMISSION_LIST.GET_SYSTEM_TRADE_HISTORY,
    ],
  },
  {
    path: '',
    name: 'Settings',
    link: '/settings',
    icon: <SettingsIcon color="inherit" />,
    layout: '/settings',
    permission: [
      PERMISSION_LIST.GET_EXCHANGE,
      PERMISSION_LIST.GET_FEATURE,
      PERMISSION_LIST.GET_GENERAL_SETTING,
      PERMISSION_LIST.GET_RESOLUTION,
      PERMISSION_LIST.GET_SYMBOL,
    ],
  },
  {
    path: '',
    name: 'Transaction',
    link: '/transaction',
    icon: <DocumentIcon color="inherit" />,
    layout: '/transaction',
    permission: [PERMISSION_LIST.GET_TRANSACTION],
  },
  {
    path: '',
    name: 'Transaction V2',
    link: '/trans-v2',
    icon: <DocumentIcon color="inherit" />,
    layout: '/trans-v2',
    permission: [PERMISSION_LIST.GET_TRANSACTION],
  },
  {
    name: 'ACCOUNT PAGES',
    category: 'account',
    state: 'pageCollapse',
    views: [
      {
        path: '',
        name: 'Profile',
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: false,
        layout: '/profile',
        link: '/profile',
      },
      // {
      //   path: "/signin",
      //   name: "Sign In",
      //   icon: <DocumentIcon color="inherit" />,
      //   layout: "/auth",
      // },
      // {
      //   path: "/signup",
      //   name: "Sign Up",
      //   icon: <RocketIcon color="inherit" />,
      //   secondaryNavbar: true,
      //   layout: "/auth",
      // },
    ],
  },
];
export default dashRoutes;
