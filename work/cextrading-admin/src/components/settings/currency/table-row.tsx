import {
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  FormControl,
  Switch,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Currency } from './interface';
import { HiPencil, HiTrash, HiChevronUp, HiChevronDown } from 'react-icons/hi';
import useMyAbility from 'hook/ability';
import { editCurrency } from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { ERROR_CODE } from 'fetcher/interface';
import { MESSAGE } from 'constants/message';
interface Props {
  index: number;
  row: Currency;
  handleEdit: () => void;
  handleDelete: () => void;
  changeOrder: (index: number, orderChange: 1 | -1) => void;
}

function TableCurrencyRow(props: Props) {
  const { index, row, changeOrder } = props;
  const ability = useMyAbility();
  const textColor = useColorModeValue('gray.700', 'white');

  const [isOpenCurrency, setIsOpenCurrency] = useState<boolean>(
    row.status || false,
  );

  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = useToastHook();
  const onChangeOnOff = () => {
    onOpen();
  };
  const handleUpdateCurrency = () => {
    setLoading(true);
    editCurrency(row.id, { status: !isOpenCurrency })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setIsOpenCurrency(!isOpenCurrency);
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
          <Image
            borderRadius="full"
            boxSize="50px"
            src={row.imageUrl}
            alt=""
            mr="10px"
          />
        </Td>
        <Td position={'sticky'} left={0} bg="white" pl="0px">
          <Text textAlign="center" color={textColor} fontWeight="bold">
            {row.name}
          </Text>
        </Td>
        <Td position={'sticky'} left={0} bg="white" pl="0px">
          <Text textAlign="center" color={textColor} fontWeight="bold">
            {row.description}
          </Text>
        </Td>
        <Td position={'sticky'} left={0} bg="white" pl="0px">
          <Text textAlign="center" color={textColor} fontWeight="bold">
            {row.currency}
          </Text>
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
            {ability.can('ROLE', ability.permissions.UPDATE_CURRENCY) && (
              <Button p="0px" variant="no-hover">
                <HiPencil onClick={props.handleEdit} />
              </Button>
            )}
            {ability.can('ROLE', ability.permissions.DELETE_CURRENCY) && (
              <Button onClick={props.handleDelete} p="0px" variant="no-hover">
                <HiTrash />
              </Button>
            )}
            {ability.can('ROLE', ability.permissions.UPDATE_CURRENCY) && (
              <>
                <FormControl display="flex" alignItems="center">
                  <Switch
                    onChange={onChangeOnOff}
                    isChecked={isOpenCurrency}
                    id="on-off-currency"
                  />
                </FormControl>
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
              </>
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
              {isOpenCurrency ? `Off ${row.currency}` : `On ${row.currency}`}
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
                onClick={handleUpdateCurrency}
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

export default TableCurrencyRow;
