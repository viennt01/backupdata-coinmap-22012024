import { Badge, Button, Text, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Feature } from './interface';
import { HiTrash, HiPencil } from 'react-icons/hi';
import { MyTd } from 'components/tables';
import useMyAbility from 'hook/ability';

interface Props {
  featureId: Feature['featureId'];
  featureName: Feature['featureName'];
  description: Feature['description'];
  action: Feature['action'];
  createdAt: Feature['createdAt'];
  handleDelete: () => void;
  handleEdit: () => void;
}

function TableFeatureRow(props: Props) {
  const {
    featureId,
    featureName,
    description,
    action,
    createdAt,
    handleDelete,
    handleEdit,
  } = props;
  const ability = useMyAbility();

  const textColor = useColorModeValue('gray.700', 'white');
  const bgStatus = useColorModeValue('teal.300', '#1a202c');

  return (
    <Tr>
      <MyTd>
        <Text color={textColor} fontWeight="bold" minWidth="100%">
          {featureId}
        </Text>
      </MyTd>

      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {featureName}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {description}
        </Text>
      </MyTd>
      <MyTd>
        <Badge p="3px 10px" borderRadius="8px" bg={bgStatus} color={textColor}>
          {action}
        </Badge>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold" pb=".5rem">
          {createdAt}
        </Text>
      </MyTd>
      <MyTd>
        {ability.can('ROLE', ability.permissions.UPDATE_FEATURE) && (
          <Button p="0px" variant="no-hover">
            <HiPencil onClick={handleEdit} />
          </Button>
        )}
        {ability.can('ROLE', ability.permissions.DELETE_FEATURE) && (
          <Button onClick={handleDelete} p="0px" variant="no-hover">
            <HiTrash />
          </Button>
        )}
      </MyTd>
    </Tr>
  );
}

export default TableFeatureRow;
