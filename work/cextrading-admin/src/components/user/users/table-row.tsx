import {
  Avatar,
  Badge,
  Button,
  Flex,
  Text,
  Tr,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { CONFIRM_EMAIL, UserList, USER_ACTIVE } from './interface';
import { HiPencil } from 'react-icons/hi';
import { MyTd } from 'components/tables';
import useMyAbility from 'hook/ability';
import CheckboxField from 'components/form/checkbox-field';

interface Props {
  user: UserList;
  handleEditing: () => void;
  handleCheckUser: (id: string, checked: boolean) => void;
}

function TableRoleRow(props: Props) {
  const { user, handleEditing, handleCheckUser } = props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');
  const textBadgeColor = useColorModeValue('gray.700', 'white');
  const bgStatus = useColorModeValue('teal.300', '#1a202c');
  const bgRedStatus = useColorModeValue('red.300', '#1a202c');

  return (
    <Tr>
      <MyTd>
        <Flex alignItems={'center'}>
          <CheckboxField
            isChecked={user.checked ? true : false}
            onChange={(e) => {
              if (e.target.checked) {
                handleCheckUser(user.id, true);
              } else {
                handleCheckUser(user.id, false);
              }
            }}
          ></CheckboxField>
          <Box py="5px" ml="5px">
            <Avatar w="50px" borderRadius="12px" me="18px" />
          </Box>
          <Text color={textColor} fontWeight="bold" minWidth="100%">
            {user.firstName} {user.lastName}
          </Text>
        </Flex>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {user.address}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {user.email}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {user.phone}
        </Text>
      </MyTd>
      <MyTd>
        {user.roles.map((r, index) => (
          <Badge
            key={index}
            p="5px 10px"
            mx="5px"
            borderRadius="8px"
            bg={bgStatus}
            color={textBadgeColor}
          >
            {r}
          </Badge>
        ))}
      </MyTd>
      <MyTd>
        <Flex justifyContent={'center'}>
          <Badge
            p="5px 10px"
            borderRadius="8px"
            bg={user.active ? bgStatus : bgRedStatus}
            color={textBadgeColor}
          >
            {user.active ? USER_ACTIVE.ACTIVE : USER_ACTIVE.DEACTIVE}
          </Badge>
        </Flex>
      </MyTd>
      <MyTd>
        <Flex justifyContent={'center'}>
          <Badge
            p="5px 10px"
            borderRadius="8px"
            bg={user.emailConfirmed ? bgStatus : bgRedStatus}
            color={textBadgeColor}
          >
            {user.emailConfirmed ? CONFIRM_EMAIL.YES : CONFIRM_EMAIL.NO}
          </Badge>
        </Flex>
      </MyTd>
      <MyTd>
        <Text color={textColor} textAlign="center" fontWeight="bold">
          {user.createdAt}
        </Text>
      </MyTd>
      <MyTd>
        {ability.can('ROLE', ability.permissions.UPDATE_USER) && (
          <Button onClick={handleEditing} p="0px" variant="no-hover">
            <HiPencil />
          </Button>
        )}
      </MyTd>
    </Tr>
  );
}

export default TableRoleRow;
