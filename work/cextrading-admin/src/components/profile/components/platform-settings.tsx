// Chakra imports
import { Badge, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { AdminList } from 'components/admin/interface';
import { Permission } from 'components/admin/role/interface';
// Custom components
import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';
import React from 'react';

interface Props {
  userProfile: AdminList;
  title: string;
  subtitle1: string;
  subtitle2: string;
}

const PlatformSettings = ({
  title,
  subtitle1,
  subtitle2,
  userProfile,
}: Props) => {
  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const textBadgeColor = useColorModeValue('gray.700', 'white');
  const bgStatus = useColorModeValue('teal.300', '#1a202c');

  const permissions = userProfile.authRoles
    .reduce<Permission[]>((total, curr) => {
      total = total.concat(curr.root.permissions);
      return total;
    }, [])
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.permissionId === value.permissionId),
    );
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Card bg={bg} borderRadius={15} p="16px">
      <CardHeader p="12px 5px" mb="12px">
        <Text fontSize="lg" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody px="5px">
        <Flex direction="column">
          <Text fontSize="sm" color="gray.500" fontWeight="600" mb="20px">
            {subtitle1}
          </Text>
          <Flex align="center" mb="20px" margin={'0 -5px'} flexWrap={'wrap'}>
            {userProfile.authRoles.map((ar) => (
              <Badge
                key={ar.id}
                p="5px 10px"
                borderRadius="8px"
                margin={'5px'}
                bg={bgStatus}
                mx="5px"
                color={textBadgeColor}
              >
                {ar.roleName}
              </Badge>
            ))}
          </Flex>
          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="600"
            m="6px 0px 20px 0px"
          >
            {subtitle2}
          </Text>
          <Flex align="center" margin={'0 -5px'} mb="20px" flexWrap={'wrap'}>
            {permissions.map((p) => (
              <Badge
                key={p.permissionId}
                p="5px 10px"
                borderRadius="8px"
                margin={'5px'}
                bg={bgStatus}
                mx="5px"
                color={textBadgeColor}
              >
                {p.permissionName}
              </Badge>
            ))}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default PlatformSettings;
