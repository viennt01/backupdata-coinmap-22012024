import { Button, Text, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { General } from './interface';
import { HiTrash, HiPencil } from 'react-icons/hi';
import { MyTd } from 'components/tables';
import useMyAbility from 'hook/ability';

interface Props {
  row: General;
  handleDelete: () => void;
  handleEdit: () => void;
}

function TableGeneralRow(props: Props) {
  const { row, handleDelete, handleEdit } = props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Tr>
      <MyTd>
        <Text color={textColor} fontWeight="bold" minWidth="100%">
          {row.generalSettingId}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {row.generalSettingName}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {row.description}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold" pb=".5rem">
          {row.createdAt}
        </Text>
      </MyTd>
      <MyTd>
        {ability.can('ROLE', ability.permissions.UPDATE_GENERAL_SETTING) && (
          <Button p="0px" variant="no-hover">
            <HiPencil onClick={handleEdit} />
          </Button>
        )}
        {ability.can('ROLE', ability.permissions.DELETE_GENERAL_SETTING) && (
          <Button onClick={handleDelete} p="0px" variant="no-hover">
            <HiTrash />
          </Button>
        )}
      </MyTd>
    </Tr>
  );
}

export default TableGeneralRow;
