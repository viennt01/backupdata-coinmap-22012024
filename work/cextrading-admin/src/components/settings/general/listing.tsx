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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
// Custom components
import { HiPlus } from 'react-icons/hi';

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { deleteGeneral, getGenerals, normalizeGeneral } from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { General } from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import TableGeneralRow from './table-row';
import { MESSAGE } from 'constants/message';
import { MyTh } from 'components/tables';
import { AbilityContext } from 'context/casl';
import { useAbility } from '@casl/react';
import { PERMISSION_LIST } from 'constants/permission-id';

interface Props {
  title: string;
  captions: string[];
  data: General[];
  handleDelete: (generalSettingId: General['generalSettingId']) => void;
  handleEdit: (generalSettingId: General['generalSettingId']) => void;
}

const captions = [
  'General ID',
  'General Name',
  'Description',
  'Create date',
  '',
];

const GeneralsTable = ({
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
                  <TableGeneralRow
                    key={row.generalSettingId}
                    row={row}
                    handleDelete={() => handleDelete(row.generalSettingId)}
                    handleEdit={() => handleEdit(row.generalSettingId)}
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

const GeneralListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useAbility(AbilityContext);

  const [generals, setGenerals] = useState<General[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generalIdSelected, setGeneralIdSeleted] = useState<
    General['generalSettingId'] | null
  >(null);

  const fetchData = () => {
    getGenerals()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const generals = normalizeGeneral(res.payload);
          setGenerals(generals);
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
    router.push('/settings/general/create');
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const handleDelete = (generalId: General['generalSettingId']) => {
    onOpen();
    setGeneralIdSeleted(generalId);
  };
  const handleEdit = (generalId: General['generalSettingId']) => {
    router.push(`/settings/general/${generalId}`);
  };

  const handleDeleteGeneral = () => {
    if (!generalIdSelected) return;
    setLoading(true);
    deleteGeneral(generalIdSelected)
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
        {ability.can('ROLE', PERMISSION_LIST.CREATE_GENERAL_SETTING) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <GeneralsTable
        title={'General List'}
        captions={captions}
        data={generals || []}
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
              Delete General
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
                onClick={handleDeleteGeneral}
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

export default GeneralListing;
