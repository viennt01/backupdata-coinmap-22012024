// Chakra imports
import { Portal, useDisclosure } from '@chakra-ui/react';
import Configurator from 'components/configurator/configurator';

// Layout components
import AdminNavbar from 'components/navbars/admin-navbar';
import Sidebar from 'components/sidebar';
import React, { useEffect, useState } from 'react';
import routes from 'constants/routes';

import FixedPlugin from '../components/fixed-plugin/fixed-plugin';
// Custom components
import MainPanel from '../components/layout/main-panel';

import PanelContainer from '../components/layout/panel-container';
import PanelContent from '../components/layout/panel-content';
import { useRouter } from 'next/router';
import { myLocalStorage } from 'utils';
import { headers } from 'fetcher/utils';
import { getUserProfile } from 'components/profile/fetcher';
import { ERROR_CODE } from 'fetcher/interface';
import { AbilityContext } from 'context/casl';
import { RawPermission } from 'components/admin/role/fetcher';
import { useAbility } from '@casl/react';
import { AbilityBuilder, Ability } from '@casl/ability';
import { PERMISSION_LIST } from 'constants/permission-id';
import { connect } from '../websocket';
interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  // states and functions
  const [sidebarVariant, setSidebarVariant] = useState('transparent');
  const [fixed, setFixed] = useState(false);
  const router = useRouter();
  const [logined, setLogined] = useState<boolean>(false);
  const ability = useAbility(AbilityContext);
  const { can, rules } = new AbilityBuilder(Ability);

  useEffect(() => {
    if (process.env.APP_ENV === 'local') {
      headers.setToken(process.env.ACCESS_TOKEN || '');
      setLogined(true);
    } else {
      const token = myLocalStorage.get('token');
      if (!token) {
        router.push('/sign-in');
      } else {
        headers.setToken(token || '');
        getUserProfile().then((res) => {
          if (res && res.error_code === ERROR_CODE.SUCCESS) {
            connect();
            setLogined(true);
            if (res.payload.super_user) {
              Object.keys(PERMISSION_LIST).forEach((k) => {
                can('ROLE', PERMISSION_LIST[k as keyof typeof PERMISSION_LIST]);
              });
            } else {
              res.payload.auth_roles
                .reduce<RawPermission['permission_id'][]>((total, current) => {
                  total = total.concat(
                    current.root.permissions.map((p) => p.permission_id),
                  );
                  return total;
                }, [])
                .forEach((p) => {
                  can('ROLE', p);
                });
            }
            ability.update(rules);
          }
        });
      }
    }
  }, []);

  const getActiveRoute = (
    routes: any,
  ): {
    name: string;
    link: string;
  } => {
    const activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        const collapseActiveRoute = getActiveRoute(routes[i].views);
        return collapseActiveRoute;
      } else if (routes[i].category) {
        const categoryActiveRoute = getActiveRoute(routes[i].views);
        return categoryActiveRoute;
      } else {
        if (router.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return {
            name: routes[i].name,
            link: routes[i].link,
          };
        }
      }
    }
    return {
      name: activeRoute,
      link: '/',
    };
  };
  // This changes navbar state(fixed or not)
  const getActiveNavbar = (routes: any): boolean => {
    const activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        const categoryActiveNavbar = getActiveNavbar(routes[i].views);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (router.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
          if (routes[i].secondaryNavbar) {
            return routes[i].secondaryNavbar;
          }
        }
      }
    }
    return activeNavbar;
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  // Chakra Color Mode
  if (!logined) return <></>;

  return (
    <>
      <Sidebar sidebarVariant={sidebarVariant} />
      <MainPanel
        w={{
          base: '100%',
          xl: 'calc(100% - 275px)',
        }}
      >
        <Portal>
          <AdminNavbar
            onOpen={onOpen}
            logoText={'COINMAP'}
            activeRoute={getActiveRoute(routes)}
            secondary={getActiveNavbar(routes)}
            fixed={fixed}
          />
        </Portal>
        <PanelContent>
          <PanelContainer>{props.children}</PanelContainer>
        </PanelContent>

        <Portal>
          <FixedPlugin
            secondary={getActiveNavbar(routes)}
            fixed={fixed}
            onOpen={onOpen}
          />
        </Portal>
        <Configurator
          secondary={getActiveNavbar(routes)}
          isOpen={isOpen}
          onClose={onClose}
          isChecked={fixed}
          onSwitch={(value) => {
            setFixed(value);
          }}
          onOpaque={() => setSidebarVariant('opaque')}
          onTransparent={() => setSidebarVariant('transparent')}
        />
      </MainPanel>
    </>
  );
}
