import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Bot } from './interface';
import { HiPencil, HiTrash } from 'react-icons/hi';
import useMyAbility from 'hook/ability';
import { editBot } from './fetcher';
import { ERROR_CODE } from 'fetcher/interface';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';

interface Props {
  row: Bot;
  handleEdit: () => void;
  handleDelete: () => void;
}

function TableBotRow(props: Props) {
  const { row } = props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');

  const [isOnBot, setIsOnBot] = useState<boolean>(row.status || false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const onChangeOnOff = () => {
    onOpen();
  };
  const toast = useToastHook();
  const handleUpdateBot = () => {
    setLoading(true);
    editBot(row.id, { status: !isOnBot })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setIsOnBot(!isOnBot);
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      })
      .finally(() => {
        onClose();
        setLoading(false);
      });
  };
  return (
    <>
      <Tr>
        <Td position={'sticky'} left={0} bg="white" pl="0px">
          <Text textAlign="center" color={textColor} fontWeight="bold">
            {row.name}
          </Text>
        </Td>
        <Td position={'sticky'} left={0} bg="white" pl="0px">
          {Object.keys(row.params).map((key) => {
            return (
              <Text key={key} color={textColor} fontWeight="bold">
                {row.params[key].name} :{' '}
                {`${JSON.stringify(row.params[key].default)}`}
              </Text>
            );
          })}
        </Td>
        <Td position={'sticky'} left={0} bg="white" pl="0px">
          <Text
            textAlign="center"
            color={textColor}
            fontWeight="bold"
            pb=".5rem"
          >
            {row.createdAt}
          </Text>
        </Td>
        <Td position={'sticky'} right={0} bg={'white'} boxShadow="base">
          <Flex>
            {ability.can('ROLE', ability.permissions.UPDATE_BOT_SETTING) && (
              <Button p="0px" variant="no-hover">
                <HiPencil onClick={props.handleEdit} />
              </Button>
            )}
            {ability.can('ROLE', ability.permissions.DELETE_BOT_SETTING) && (
              <Button onClick={props.handleDelete} p="0px" variant="no-hover">
                <HiTrash />
              </Button>
            )}
            {ability.can('ROLE', ability.permissions.UPDATE_BOT_SETTING) && (
              <FormControl display="flex" alignItems="center">
                <Switch
                  onChange={onChangeOnOff}
                  isChecked={isOnBot}
                  id="on-off-role"
                />
                <FormLabel htmlFor="on-off-register" mb="0" ml="12px">
                  On
                </FormLabel>
              </FormControl>
            )}
          </Flex>
        </Td>
      </Tr>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isOnBot ? `Off ${row.name}` : `On ${row.name}`}
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                bg="gray.300"
                color={'gray.800'}
                variant="no-hover"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                isLoading={loading}
                colorScheme="red"
                onClick={handleUpdateBot}
                ml={3}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default TableBotRow;
