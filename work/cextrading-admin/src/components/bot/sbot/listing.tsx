// Chakra imports
import {
  Table,
  Tbody,
  Text,
  Thead,
  Tr,
  Flex,
  useColorModeValue,
  Button,
  Td,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';
// Custom components
import { HiPlus } from 'react-icons/hi';

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ERROR_CODE } from 'fetcher/interface';
import TableBotRow from './table-row';
import { MyTh } from 'components/tables';
import useToastHook, { STATUS } from 'components/hook/toast';
import useMyAbility from 'hook/ability';
import { Bot } from './interface';
import { deleteBot, getListBots, normalizeBot } from './fetcher';
import { MESSAGE } from 'constants/message';

interface Props {
  title: string;
  captions: string[];
  data: Bot[];
  handleEditing: (id: Bot['id']) => void;
  handleDelete: (id: Bot['id']) => void;
}

const BotTable = ({
  title,
  captions,
  data,
  handleEditing,
  handleDelete,
}: Props) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Card bg={bg} borderRadius={15}>
      <CardHeader p="6px 0px 22px 0px">
        <Text fontSize="xl" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody maxHeight="50vh" overflow="auto">
        <Table size="sm" variant="simple" color={textColor}>
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
                  <TableBotRow
                    key={row.id}
                    bot={row}
                    handleEditing={() => handleEditing(row.id)}
                    handleDelete={() => handleDelete(row.id)}
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

const PackageTimeListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const [bots, setBots] = useState<Bot[] | null>(null);

  const fetchData = () => {
    getListBots()
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const res = rawRes.payload.map((row) => {
            return normalizeBot(row);
          });
          setBots(res);
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
  }, [router]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [roleSelected, setRoleSelected] = useState<Bot['id'] | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const handleCreate = () => {
    router.push('/bot/sbot/create');
  };

  const handleEditing = (id: Bot['id']) => {
    router.push(`/bot/sbot/${id}`);
  };

  const handleDelete = (roleId: Bot['id']) => {
    onOpen();
    setRoleSelected(roleId);
  };

  const handleDeleteBot = () => {
    if (!roleSelected) return;
    setLoading(true);
    deleteBot(roleSelected)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          fetchData();
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          onClose();
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Flex align="center" justifyContent="end" mb="20px">
        {ability.can('ROLE', ability.permissions.CREATE_BOT) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <BotTable
        title={'Bot signal'}
        captions={[
          'Bot name',
          'Description',
          'Type',
          'Status',
          'Price',
          'Image',
          'Work based on',
          'order',
          'Update date',
          'Create date',
          '',
        ]}
        data={bots || []}
        handleEditing={handleEditing}
        handleDelete={handleDelete}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Role
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

export default PackageTimeListing;
