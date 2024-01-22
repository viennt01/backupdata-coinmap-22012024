import { Badge, Button, Text, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Role } from './interface';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { MyTd } from 'components/tables';
import useMyAbility from 'hook/ability';

interface Props {
  roleName: Role['roleName'];
  description: Role['description'];
  root: Role['root'];
  createdAt: Role['createdAt'];
  handleDelete: () => void;
  handleEdit: () => void;
}

function TableRoleRow(props: Props) {
  const { roleName, description, root, createdAt, handleDelete, handleEdit } =
    props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');
  const bgBadge = useColorModeValue('teal.300', '#1a202c');

  return (
    <Tr>
      <MyTd position={'sticky'} left={0} bg="white">
        <Text color={textColor} fontWeight="bold" minWidth="100%">
          {roleName}
        </Text>
      </MyTd>

      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {description}
        </Text>
      </MyTd>
      <MyTd>
        {root.permissions.map((p) => (
          <Badge
            bg={bgBadge}
            color={textColor}
            p="3px 10px"
            borderRadius="8px"
            m="5px"
            key={p.permissionId}
          >
            {p.permissionName}
          </Badge>
        ))}
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold" pb=".5rem">
          {createdAt}
        </Text>
      </MyTd>
      <MyTd position={'sticky'} right={0} bg="white">
        {ability.can('ROLE', ability.permissions.UPDATE_AUTH_ROLE) && (
          <Button p="0px" variant="no-hover">
            <HiPencil onClick={handleEdit} />
          </Button>
        )}
        {ability.can('ROLE', ability.permissions.DELETE_AUTH_ROLE) && (
          <Button onClick={handleDelete} p="0px" variant="no-hover">
            <HiTrash />
          </Button>
        )}
      </MyTd>
    </Tr>
  );
}

export default TableRoleRow;
