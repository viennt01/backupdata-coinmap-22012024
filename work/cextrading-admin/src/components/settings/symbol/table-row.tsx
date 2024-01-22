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
  Switch,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ISymbol, SYMBOL_STATUS, Tick } from './interface';
import { MyTd } from 'components/tables';
import { HiPencil, HiTrash } from 'react-icons/hi';
import useMyAbility from 'hook/ability';
import { editSymbol } from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';

interface Props {
  row: ISymbol;
  handleEdit: () => void;
  handleDelete: () => void;
}

function TableSymbolRow(props: Props) {
  const { row } = props;
  const ability = useMyAbility();
  const toast = useToastHook();

  const textColor = useColorModeValue('gray.700', 'white');

  const [isOnChart, setIsOnChart] = useState<SYMBOL_STATUS>(row.status);

  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const onChangeOnOff = () => {
    onOpen();
  };
  const handleUpdateSymbol = () => {
    setLoading(true);
    const newStatus =
      isOnChart === SYMBOL_STATUS.ON ? SYMBOL_STATUS.OFF : SYMBOL_STATUS.ON;
    const data = {
      status: newStatus,
    };

    return editSymbol(data, row.symbol)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setIsOnChart(newStatus);
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
      <Tr height={'40px'}>
        <MyTd>
          <Text color={textColor} fontWeight="bold" minWidth="100%">
            {row.symbol}
          </Text>
        </MyTd>

        <MyTd>
          <Text textAlign="center" color={textColor} fontWeight="bold">
            {row.types}
          </Text>
        </MyTd>
        <MyTd>
          <Text textAlign="center" color={textColor} fontWeight="bold">
            {row.exchangeName}
          </Text>
        </MyTd>
        <MyTd>
          <Text textAlign="center" color={textColor} fontWeight="bold">
            {row.baseSymbol}
          </Text>
        </MyTd>
        <MyTd>
          <Text textAlign="center" color={textColor} fontWeight="bold">
            {row.quoteSymbol}
          </Text>
        </MyTd>
        <MyTd>
          <Text color={textColor} fontWeight="bold">
            {row.description}
          </Text>
        </MyTd>
        <MyTd py="5px">
          {Object.keys(row.ticks).map((key) => {
            return (
              <Text key={key} color={textColor} fontWeight="bold">
                {key}: {row.ticks[key as keyof Tick]}
              </Text>
            );
          })}
        </MyTd>
        <MyTd>
          <Text
            textAlign="right"
            color={textColor}
            fontWeight="bold"
            pb=".5rem"
          >
            {row.createdAt}
          </Text>
        </MyTd>
        <MyTd position={'sticky'} right={0} bg={'white'} boxShadow="base">
          <Flex>
            {ability.can('ROLE', ability.permissions.UPDATE_SYMBOL) && (
              <Button p="0px" variant="no-hover">
                <HiPencil onClick={props.handleEdit} />
              </Button>
            )}
            {ability.can('ROLE', ability.permissions.DELETE_SYMBOL) && (
              <Button onClick={props.handleDelete} p="0px" variant="no-hover">
                <HiTrash />
              </Button>
            )}
            {ability.can('ROLE', ability.permissions.UPDATE_CURRENCY) && (
              <FormControl display="flex" alignItems="center">
                <Switch
                  onChange={onChangeOnOff}
                  isChecked={isOnChart === SYMBOL_STATUS.ON}
                  id="on-off-currency"
                />
              </FormControl>
            )}
          </Flex>
        </MyTd>
      </Tr>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isOnChart ? `Off ${row.symbol}` : `On ${row.symbol}`}
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
                onClick={handleUpdateSymbol}
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

export default TableSymbolRow;
