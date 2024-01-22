/*eslint-disable*/
// chakra imports
import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import IconBox from 'components/icons/icon-box';
import { Separator } from 'components/separator/separator';
import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import routes, { DashRoutes, Routes } from 'constants/routes';
import { useAbility } from '@casl/react';
import { AbilityContext } from 'context/casl';
// this function creates the links and collapses that appear in the sidebar (left menu)

interface Props {
  logoText: String;
  sidebarVariant: string;
}

const SidebarContent = ({ logoText, sidebarVariant }: Props) => {
  const router = useRouter();
  const ability = useAbility(AbilityContext);

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return router.pathname.includes(routeName) ? 'active' : '';
  };
  const createLinks = (routes: Routes) => {
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
            {createLinks(prop.views || [])}
          </div>
        );
      }
      if (
        prop.permission &&
        prop.permission.some((p) => ability.can('ROLE', p))
      ) {
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
                _hover={{ backgroundColor: 'none' }}
                borderRadius="15px"
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
      }
      if (!prop.permission) {
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
                _hover={{ backgroundColor: 'none' }}
                borderRadius="15px"
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
      }
    });
  };

  const links = <>{createLinks(routes)}</>;

  return (
    <>
      <Box>
        <Box pt={'25px'} mb="12px">
          <NextLink href={`/`}>
            <Link
              display="flex"
              lineHeight="100%"
              fontWeight="bold"
              mb="30px"
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
          </NextLink>
          <Separator></Separator>
        </Box>
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
    </>
  );
};

export default SidebarContent;
