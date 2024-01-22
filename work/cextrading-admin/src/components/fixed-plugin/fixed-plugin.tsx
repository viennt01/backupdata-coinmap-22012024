// Chakra Imports
import { Button, useColorModeValue } from '@chakra-ui/react';
// Custom Icons
import { SettingsIcon } from 'components/icons/icons';
import PropTypes from 'prop-types';
import React from 'react';

interface Props {
  secondary: boolean;
  fixed: boolean;
  onOpen: () => void;
}

export default function FixedPlugin(props: Props) {
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.500', 'gray.200');
  const bgButton = useColorModeValue('white', 'gray.600');

  const settingsRef = React.useRef<SVGSVGElement | null>(null);
  return (
    <>
      <Button
        h="52px"
        w="52px"
        onClick={props.onOpen}
        bg={bgButton}
        position="fixed"
        variant="no-hover"
        left={''}
        right={'35px'}
        bottom="30px"
        borderRadius="50px"
        boxShadow="0 2px 12px 0 rgb(0 0 0 / 16%)"
      >
        <SettingsIcon
          cursor="pointer"
          ref={settingsRef}
          color={navbarIcon}
          w="20px"
          h="20px"
        />
      </Button>
    </>
  );
}

FixedPlugin.propTypes = {
  fixed: PropTypes.bool,
  onChange: PropTypes.func,
  onSwitch: PropTypes.func,
};
