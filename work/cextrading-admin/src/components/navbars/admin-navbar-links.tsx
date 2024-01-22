// Chakra Icons
import { BellIcon } from '@chakra-ui/icons';
// Chakra Imports
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';

// Custom Icons
import { SettingsIcon } from 'components/icons/icons';
// Custom Components
import { ItemContent } from 'components/menu/item-content';
import SidebarResponsive from 'components/sidebar/sidebar-responsive';
import PropTypes from 'prop-types';
import React from 'react';

const avatar1 = '/assets/img/avatars/avatar1.png';
const avatar2 = '/assets/img/avatars/avatar2.png';
const avatar3 = '/assets/img/avatars/avatar3.png';

interface Props {
  secondary: boolean;
  logoText: string;
  onOpen: () => void;
  fixed: boolean;
}

export default function HeaderLinks(props: Props) {
  const { secondary } = props;

  // Chakra Color Mode
  let navbarIcon = useColorModeValue('gray.500', 'gray.200');

  if (secondary) {
    navbarIcon = 'white';
  }
  const settingsRef = React.useRef<SVGSVGElement>(null);
  return (
    <Flex
      pe={{ sm: '0px', md: '16px' }}
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
    >
      {/* <InputGroup
        cursor="pointer"
        bg={inputBg}
        borderRadius="15px"
        w={{
          sm: "128px",
          md: "200px",
        }}
        me={{ sm: "auto", md: "20px" }}
        _focus={{
          borderColor: { mainTeal },
        }}
        _active={{
          borderColor: { mainTeal },
        }}
      >
        <InputLeftElement>
         <IconButton
            bg="inherit"
            borderRadius="inherit"
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            icon={<SearchIcon color={searchIcon} w="15px" h="15px" />} aria-label={""}            ></IconButton>
            </InputLeftElement>
        <Input
          fontSize="xs"
          py="11px"
          color={mainText}
          placeholder="Type here..."
          borderRadius="inherit"
        />
      </InputGroup> */}
      {/* <NextLink href="/auth/signin">
        <Button
          ms="0px"
          px="0px"
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant="transparent-with-icon"
          rightIcon={<ProfileIcon color={navbarIcon} w="22px" h="22px" me="0px" />}
        >
          <Text display={{ sm: "none", md: "flex" }}>Sign In</Text>
        </Button>
      </NextLink> */}
      <SidebarResponsive
        logoText={props.logoText}
        secondary={props.secondary}
        // logo={logo}
      />
      <SettingsIcon
        cursor="pointer"
        ms={{ base: '16px', xl: '0px' }}
        me="16px"
        ref={settingsRef}
        onClick={props.onOpen}
        color={navbarIcon}
        w="18px"
        h="18px"
      />
      <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w="18px" h="18px" />
        </MenuButton>
        <MenuList p="16px 8px">
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="13 minutes ago"
                info="from Alicia"
                boldInfo="New Message"
                aName="Alicia"
                aSrc={avatar1}
              />
            </MenuItem>
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="2 days ago"
                info="by Josh Henry"
                boldInfo="New Album"
                aName="Josh Henry"
                aSrc={avatar2}
              />
            </MenuItem>
            <MenuItem borderRadius="8px">
              <ItemContent
                time="3 days ago"
                info="Payment succesfully completed!"
                boldInfo=""
                aName="Kara"
                aSrc={avatar3}
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
