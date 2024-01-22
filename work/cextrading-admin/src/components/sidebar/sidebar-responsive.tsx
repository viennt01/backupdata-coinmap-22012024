/*eslint-disable*/
import { HamburgerIcon } from '@chakra-ui/icons';
// chakra imports
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import IconBox from 'components/icons/icon-box';
import { Separator } from 'components/separator/separator';
import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import routes, { DashRoutes } from 'constants/routes';

interface Props {
  logoText: string;
  secondary: boolean;
}

function SidebarResponsive(props: Props) {
  const router = useRouter();

  const mainPanel = React.useRef<HTMLDivElement | null>(null);
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return router.pathname === routeName ? 'active' : '';
  };

  const createLinks = (routes: DashRoutes[]) => {
    // Chakra Color Mode
    const activeBg = useColorModeValue('white', 'gray.700');
    const inactiveBg = useColorModeValue('white', 'gray.700');
    const activeColor = useColorModeValue('gray.700', 'white');
    const inactiveColor = useColorModeValue('gray.400', 'gray.400');

    return routes.map((prop: DashRoutes) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        return (
          <div key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: '12px',
              }}
              mx="auto"
              ps={{
                sm: '10px',
                xl: '16px',
              }}
              py="12px"
            >
              {prop.name}
            </Text>
            {createLinks(prop.views ? prop.views : [])}
          </div>
        );
      }
      return (
        <NextLink href={prop.layout || '' + prop.path} key={prop.name}>
          {activeRoute(prop.layout || '' + prop.path) === 'active' ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg={activeBg}
              mb={{
                xl: '12px',
              }}
              mx={{
                xl: 'auto',
              }}
              ps={{
                sm: '10px',
                xl: '16px',
              }}
              py="12px"
              borderRadius="15px"
              _hover={{ backgroundColor: 'none' }}
              w="100%"
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent',
              }}
              _focus={{
                boxShadow: 'none',
              }}
            >
              <Flex>
                {typeof prop.icon === 'string' ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg="teal.300"
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={activeColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{
                xl: '12px',
              }}
              mx={{
                xl: 'auto',
              }}
              py="12px"
              ps={{
                sm: '10px',
                xl: '16px',
              }}
              borderRadius="15px"
              _hover={{ backgroundColor: 'none' }}
              w="100%"
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent',
              }}
              _focus={{
                boxShadow: 'none',
              }}
            >
              <Flex>
                {typeof prop.icon === 'string' ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={inactiveBg}
                    color="teal.300"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NextLink>
      );
    });
  };

  const { logoText, ...rest } = props;

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  //  Chakra Color Mode
  let hamburgerColor = useColorModeValue('gray.500', 'gray.200');
  if (props.secondary === true) {
    hamburgerColor = 'white';
  }
  var brand = (
    <Box pt={'35px'} mb="8px">
      <Link
        href={`${process.env.PUBLIC_URL}/#/`}
        target="_blank"
        display="flex"
        mb="30px"
        lineHeight="100%"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        fontSize="11px"
      >
        <img
          width={32}
          height={32}
          src="/images/favicon-32x32.png"
          alt="logo"
        />
        <Text fontSize="sm" ml={'10px'} mt="3px">
          {logoText}
        </Text>
      </Link>
      <Separator></Separator>
    </Box>
  );

  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<SVGSVGElement | null>(null);
  // Color variables
  return (
    <Flex
      display={{ sm: 'flex', xl: 'none' }}
      ref={mainPanel}
      alignItems="center"
    >
      <HamburgerIcon
        color={hamburgerColor}
        w="18px"
        h="18px"
        ref={btnRef}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={'left'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          maxW="250px"
          ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }}
          borderRadius="16px"
        >
          <DrawerCloseButton
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody position={'relative'} maxW="250px" px="1rem">
            <Box maxW="100%" h="100vh">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
              <Text
                position={'absolute'}
                bottom={0}
                left={0}
                right={0}
                mb="12px"
                textAlign={'center'}
                color="teal.300"
              >
                v{process.env.VERSION}
              </Text>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default SidebarResponsive;
