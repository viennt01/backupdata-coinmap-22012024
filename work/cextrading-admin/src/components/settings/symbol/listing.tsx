// Chakra imports
import {
  Table,
  Tbody,
  Text,
  Thead,
  Tr,
  useColorModeValue,
  Td,
  Button,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
// Custom components

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import React, { useEffect, useState } from 'react';
import { getSymbols, normalizeSymbol } from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { ISymbol } from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import TableSymbolRow from './table-row';
import { MyTh } from 'components/tables';
import { useRouter } from 'next/router';
import { HiPlus } from 'react-icons/hi';
import { MESSAGE } from 'constants/message';
import { deleteSymbol } from './fetcher';
import useMyAbility from 'hook/ability';

interface Props {
  title: string;
  captions: string[];
  data: ISymbol[];
  handleEdit: (symbol: ISymbol['symbol']) => void;
  handleDelete: (symbol: ISymbol['symbol']) => void;
}

const captions = [
  'Symbol',
  'Type',
  'Exchange name',
  'Base symbol',
  'Quote symbol',
  'Description',
  'Ticks',
  'Create Date',
  '',
];

const SymbolsTable = ({
  title,
  captions,
  data,
  handleDelete,
  handleEdit,
}: Props) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Card bg={bg} borderRadius={15} overflowX={{ sm: 'scroll', xl: 'hidden' }}>
      <CardHeader p="6px 0px 22px 0px">
        <Text fontSize="xl" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody maxHeight="50vh" overflow="auto">
        <Table size={'sm'} variant="simple" color={textColor}>
          <Thead>
            <Tr whiteSpace={'nowrap'} my=".8rem" pl="0px" color="gray.400">
              {captions.map((caption, idx) => {
                return <MyTh key={idx}>{caption}</MyTh>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((row) => {
                return (
                  <TableSymbolRow
                    key={row.symbol}
                    row={row}
                    handleDelete={() => handleDelete(row.symbol)}
                    handleEdit={() => handleEdit(row.symbol)}
                  />
                );
              })
            ) : (
              <Tr>
                <Td
                  textAlign={'center'}
                  color="gray.400"
                  colSpan={captions.length}
                >
                  No Data
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default function SymbolListing(): JSX.Element {
  const toast = useToastHook();
  const [symbols, setSymbols] = useState<ISymbol[] | null>(null);
  const router = useRouter();
  const ability = useMyAbility();

  const [loading, setLoading] = useState<boolean>(false);
  const [symbolSelected, setSymbolSelected] = useState<
    ISymbol['symbol'] | null
  >(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const fetchData = () => {
    getSymbols()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const symbols = normalizeSymbol(res.payload);
          setSymbols(symbols);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    router.push('/settings/symbol/create');
  };

  const handleDelete = (symbol: ISymbol['symbol']) => {
    onOpen();
    setSymbolSelected(symbol);
  };
  const handleEdit = (symbolName: ISymbol['symbol']) => {
    router.push(`/settings/symbol/${symbolName}`);
  };

  const handleDeleteSymbol = () => {
    if (!symbolSelected) return;
    setLoading(true);
    deleteSymbol(symbolSelected)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          fetchData();
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          onClose();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Flex align="center" justify="end" mb="20px">
        {ability.can('ROLE', ability.permissions.CREATE_SYMBOL) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <SymbolsTable
        title={'Symbol List'}
        captions={captions}
        data={symbols || []}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Symbol
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

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
                onClick={handleDeleteSymbol}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
