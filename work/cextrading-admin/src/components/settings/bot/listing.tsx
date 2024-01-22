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
import { deleteBot, getBots, normalizeBot } from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { ERROR_CODE } from 'fetcher/interface';
import TableRow from './table-row';
import { MyTh } from 'components/tables';
import { Bot } from './interface';
import { HiPlus } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { MESSAGE } from 'constants/message';
import useMyAbility from 'hook/ability';

interface Props {
  title: string;
  captions: string[];
  data: Bot[];
  handleEdit: (id: Bot['id']) => void;
  handleDelete: (id: Bot['id']) => void;
}

const captions = ['Name', 'Params', 'Create Date', ''];

const BotTable = ({
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
                return (
                  <MyTh key={idx} textAlign="center">
                    {caption}
                  </MyTh>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    row={row}
                    handleDelete={() => handleDelete(row.id)}
                    handleEdit={() => handleEdit(row.id)}
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

const BotListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const [bots, setBots] = useState<Bot[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [botSelected, setBotSelected] = useState<Bot['id'] | null>(null);

  const fetchData = () => {
    getBots()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const resBots = normalizeBot(res.payload);
          setBots(resBots);
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const handleCreate = () => {
    router.push('/settings/bot/create');
  };
  const handleEdit = (id: Bot['id']) => {
    router.push(`/settings/bot/${id}`);
  };

  const handleDelete = (id: Bot['id']) => {
    onOpen();
    setBotSelected(id);
  };

  const handleDeleteBot = () => {
    if (!botSelected) return;
    setLoading(true);
    deleteBot(botSelected)
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
        {ability.can('ROLE', ability.permissions.CREATE_BOT_SETTING) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <BotTable
        title={'Bot List'}
        captions={captions}
        data={bots || []}
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
              Delete Bot
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
                onClick={handleDeleteBot}
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
};

export default BotListing;
