import {
  Badge,
  Button,
  Flex,
  HStack,
  Tag,
  TagLabel,
  Text,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { Bot } from './interface';
import { HiPencil, HiTrash, HiDocumentDuplicate } from 'react-icons/hi';
import { MyTd } from 'components/tables';
import useMyAbility from 'hook/ability';

interface Props {
  bot: Bot;
  handleCloneBot: () => void;
  handleEditing: () => void;
  handleDelete: () => void;
}

function TableBotRow(props: Props) {
  const { bot, handleEditing, handleDelete, handleCloneBot } = props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');
  const textBadgeColor = useColorModeValue('gray.700', 'white');
  const bgStatus = useColorModeValue('teal.300', '#1a202c');
  const bgRedStatus = useColorModeValue('red.300', '#1a202c');
  return (
    <Tr>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {bot.name}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {bot.cloneName}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.type}
        </Text>
      </MyTd>
      <MyTd>
        <Flex justifyContent={'center'}>
          <Badge
            p="5px 10px"
            borderRadius="8px"
            bg={bot.status ? bgStatus : bgRedStatus}
            color={textBadgeColor}
          >
            {bot.status}
          </Badge>
        </Flex>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.code || 0}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.tokenFirst}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.tokenSecond}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.price || 0}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.description || 0}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.pnl || 0}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.max_drawdown || 0}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          <HStack spacing={4} align="start">
            {bot.workBasedOn.map((w) => (
              <Tag
                key={w}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
                marginBottom={2}
              >
                <TagLabel>{w}</TagLabel>
              </Tag>
            ))}
          </HStack>
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.order}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {bot.updatedAt}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} textAlign="center" fontWeight="bold">
          {bot.createdAt}
        </Text>
      </MyTd>
      <MyTd>
        {ability.can('ROLE', ability.permissions.UPDATE_BOT_TRADING) && (
          <Button onClick={handleEditing} p="0px" variant="no-hover">
            <HiPencil />
          </Button>
        )}
        {ability.can('ROLE', ability.permissions.UPDATE_BOT_TRADING) && (
          <Button onClick={handleCloneBot} p="0px" variant="no-hover">
            <HiDocumentDuplicate />
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

export default TableBotRow;
