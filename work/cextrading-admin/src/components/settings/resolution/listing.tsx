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
import {
  deleteResolution,
  getResolutions,
  normalizeResolution,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { ERROR_CODE } from 'fetcher/interface';
import TableResolutionRow from './table-row';
import { MyTh } from 'components/tables';
import { Resolution } from './interface';
import { HiPlus } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { MESSAGE } from 'constants/message';
import useMyAbility from 'hook/ability';

interface Props {
  title: string;
  captions: string[];
  data: Resolution[];
  handleDelete: (resolutionName: Resolution['resolutionsName']) => void;
  handleEdit: (resolutionName: Resolution['resolutionsName']) => void;
}

const captions = ['Name', 'Diplay Name', 'Create Date', ''];

const ResolutionTable = ({
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
                  <TableResolutionRow
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

const FeatureListing = (): JSX.Element => {
  const toast = useToastHook();
  const router = useRouter();
  const ability = useMyAbility();

  const [resolutions, setResolutions] = useState<Resolution[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resolutionSelected, setResolutionSelected] = useState<
    Resolution['id'] | null
  >(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const fetchData = () => {
    getResolutions()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const resolutions = normalizeResolution(res.payload);
          setResolutions(resolutions);
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
    router.push('/settings/resolution/create');
  };
  const handleEdit = (id: Resolution['id']) => {
    router.push(`/settings/resolution/${id}`);
  };

  const handleDelete = (id: Resolution['id']) => {
    onOpen();
    setResolutionSelected(id);
  };

  const handleDeleteResolutions = () => {
    if (!resolutionSelected) return;
    setLoading(true);
    deleteResolution(resolutionSelected)
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
        {ability.can('ROLE', ability.permissions.CREATE_RESOLUTION) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <ResolutionTable
        title={'Resolution List'}
        captions={captions}
        data={resolutions || []}
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
              Delete Resolution
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
                onClick={handleDeleteResolutions}
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

export default FeatureListing;
