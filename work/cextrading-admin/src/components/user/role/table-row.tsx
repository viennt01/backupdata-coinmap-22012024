import {
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { Role, ROLE_STATUS } from './interface';
import { HiTrash, HiPencil, HiChevronUp, HiChevronDown } from 'react-icons/hi';
import useMyAbility from 'hook/ability';

interface Props {
  index: number;
  id: Role['id'];
  roleName: Role['roleName'];
  description: Role['description'];
  root: Role['root'];
  createdAt: Role['createdAt'];
  handleDelete: () => void;
  handleEditing: () => void;
  changeOrder: (index: number, orderChange: 1 | -1) => void;
  type: string;
  price: string;
  currency: string;
  status: string;
}

function TableRoleRow(props: Props) {
  const {
    index,
    roleName,
    description,
    root,
    createdAt,
    handleDelete,
    handleEditing,
    changeOrder,
    type,
    price,
    currency,
    status,
  } = props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');
  const textBadgeColor = useColorModeValue('gray.700', 'white');
  const bgStatus = useColorModeValue('teal.300', '#1a202c');

  let statusColor;
  switch (status) {
    case ROLE_STATUS.OPEN:
      statusColor = 'green';
      break;
    case ROLE_STATUS.COMINGSOON:
      statusColor = 'orange';
      break;
    case ROLE_STATUS.CLOSE:
      statusColor = 'red';
      break;
    default:
      statusColor = 'gray.700';
  }
  const textStatusColor = useColorModeValue(statusColor, 'white');
  return (
    <Tr>
      <Td position={'sticky'} left={0} bg="white" pl="0px">
        <Text color={textColor} fontWeight="bold">
          {roleName}
        </Text>
      </Td>

      <Td whiteSpace={'nowrap'}>
        <Text color={textColor} fontWeight="bold">
          {description}
        </Text>
      </Td>
      <Td whiteSpace={'nowrap'}>
        <Text color={textColor} fontWeight="bold">
          {type}
        </Text>
      </Td>
      <Td whiteSpace={'nowrap'}>
        <Text color={textColor} fontWeight="bold">
          {price}
        </Text>
      </Td>
      <Td whiteSpace={'nowrap'}>
        <Text color={textColor} fontWeight="bold">
          {currency}
        </Text>
      </Td>
      <Td whiteSpace={'nowrap'}>
        <Text color={textStatusColor} fontWeight="bold">
          {status}
        </Text>
      </Td>
      <Td whiteSpace={'nowrap'}>
        {root.generalSettings.map((g) => (
          <Badge
            p="3px 10px"
            borderRadius="8px"
            margin={'5px'}
            key={g.generalSettingId}
            bg={bgStatus}
            color={textBadgeColor}
          >
            {g.generalSettingName} ({g.valLimit})
          </Badge>
        ))}
      </Td>
      <Td whiteSpace={'nowrap'}>
        {root.features.map((p) => (
          <Badge
            p="3px 10px"
            borderRadius="8px"
            margin={'5px'}
            key={p.featureId}
            bg={bgStatus}
            color={textBadgeColor}
          >
            {p.featureName}
          </Badge>
        ))}
      </Td>
      <Td whiteSpace={'nowrap'}>
        {root.symbolSettingsRoles.map((p) =>
          p.exchanges.map((ex) => (
            <Badge
              p="3px 10px"
              borderRadius="8px"
              margin={'5px'}
              key={`${p.id}-${ex.exchangeName}`}
              bg={bgStatus}
              color={textBadgeColor}
            >
              {ex.exchangeName}
            </Badge>
          )),
        )}
      </Td>
      <Td whiteSpace={'nowrap'}>
        {root.symbolSettingsRoles.map((p) =>
          p.symbols.map((s) => (
            <Badge
              p="3px 10px"
              borderRadius="8px"
              margin={'5px'}
              key={`${p.id}-${s.symbol}`}
              bg={bgStatus}
              color={textBadgeColor}
            >
              {s.symbol}
            </Badge>
          )),
        )}
      </Td>
      <Td whiteSpace={'nowrap'}>
        {root.symbolSettingsRoles.map((p) =>
          p.resolutions.map((s) => (
            <Badge
              p="3px 10px"
              borderRadius="8px"
              mx="5px"
              key={`${p.id}-${s.resolutionsName}`}
              bg={bgStatus}
              color={textBadgeColor}
            >
              {s.displayName}
            </Badge>
          )),
        )}
      </Td>
      <Td>
        <Text color={textColor} fontWeight="bold" pb=".5rem">
          {createdAt}
        </Text>
      </Td>
      <Td position={'sticky'} right={0} bg={'white'} boxShadow="base">
        <Flex>
          {ability.can('ROLE', ability.permissions.UPDATE_ROLE) && (
            <Button onClick={handleEditing} p="0px" variant="no-hover">
              <HiPencil />
            </Button>
          )}
          {ability.can('ROLE', ability.permissions.DELETE_ROLE) && (
            <Button onClick={handleDelete} p="0px" variant="no-hover">
              <HiTrash />
            </Button>
          )}
          {ability.can('ROLE', ability.permissions.UPDATE_ROLE) && (
            <Flex flexDirection="column">
              <HiChevronUp
                size={20}
                cursor="pointer"
                onClick={() => changeOrder(index, 1)}
              />
              <HiChevronDown
                size={20}
                cursor="pointer"
                onClick={() => changeOrder(index, -1)}
              />
            </Flex>
          )}
        </Flex>
      </Td>
    </Tr>
  );
}

export default TableRoleRow;
