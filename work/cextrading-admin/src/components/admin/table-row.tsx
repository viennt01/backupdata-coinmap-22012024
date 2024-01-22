import {
  Avatar,
  Badge,
  Button,
  Flex,
  Text,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { AdminList, USER_ACTIVE } from './interface';
import { HiPencil } from 'react-icons/hi';
import { MyTd } from 'components/tables';
import useMyAbility from 'hook/ability';

interface Props {
  admin: AdminList;
  handleEditing: () => void;
}

function TableRoleRow(props: Props) {
  const { admin, handleEditing } = props;
  const ability = useMyAbility();

  const textColor = useColorModeValue('gray.700', 'white');
  const textBadgeColor = useColorModeValue('gray.700', 'white');
  const bgStatus = useColorModeValue('teal.300', '#1a202c');
  const bgRedStatus = useColorModeValue('red.300', '#1a202c');

  return (
    <Tr>
      <MyTd>
        <Flex alignItems={'center'} py="5px">
          <Avatar w="50px" borderRadius="12px" me="18px" />
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
          >
            {admin.firstName} {admin.lastName}
          </Text>
        </Flex>
      </MyTd>

      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {admin.address}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {admin.email}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {admin.phone}
        </Text>
      </MyTd>
      <MyTd>
        {admin.authRoles.map((ar) => (
          <Badge
            key={ar}
            p="5px 10px"
            borderRadius="8px"
            bg={bgStatus}
            mx="5px"
            color={textBadgeColor}
          >
            {ar}
          </Badge>
        ))}
      </MyTd>
      <MyTd>
        <Badge
          p="5px 10px"
          borderRadius="8px"
          bg={admin.active ? bgStatus : bgRedStatus}
          color={textBadgeColor}
        >
          {admin.active ? USER_ACTIVE.ACTIVE : USER_ACTIVE.DEACTIVE}
        </Badge>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold" pb=".5rem">
          {admin.createdAt}
        </Text>
      </MyTd>
      <MyTd>
        {ability.can('ROLE', ability.permissions.UPDATE_ADMIN) && (
          <Button onClick={handleEditing} p="0px" variant="no-hover">
            <HiPencil />
          </Button>
        )}
      </MyTd>
    </Tr>
  );
}

export default TableRoleRow;
