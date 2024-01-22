import { Button, Text, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Resolution } from './interface';
import { MyTd } from 'components/tables';
import { HiPencil, HiTrash } from 'react-icons/hi';
import useMyAbility from 'hook/ability';

interface Props {
  row: Resolution;
  handleEdit: () => void;
  handleDelete: () => void;
}

function TableResolutionRow(props: Props) {
  const { row } = props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Tr height={'40px'}>
      <MyTd>
        <Text textAlign="center" color={textColor} fontWeight="bold">
          {row.resolutionsName}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="center" color={textColor} fontWeight="bold">
          {row.displayName}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="center" color={textColor} fontWeight="bold" pb=".5rem">
          {row.createdAt}
        </Text>
      </MyTd>
      <MyTd>
        {ability.can('ROLE', ability.permissions.UPDATE_RESOLUTION) && (
          <Button p="0px" variant="no-hover">
            <HiPencil onClick={props.handleEdit} />
          </Button>
        )}
        {ability.can('ROLE', ability.permissions.DELETE_RESOLUTION) && (
          <Button onClick={props.handleDelete} p="0px" variant="no-hover">
            <HiTrash />
          </Button>
        )}
      </MyTd>
    </Tr>
  );
}

export default TableResolutionRow;
