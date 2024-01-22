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
import { deleteAdminRole, getAdminRoles, normalizeAdminRole } from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { Role } from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import TableRoleRow from './table-row';
import { MESSAGE } from 'constants/message';
import { MyTh } from 'components/tables';
import useMyAbility from 'hook/ability';

interface Props {
  title: string;
  captions: string[];
  data: Role[];
  handleDelete: (roleId: Role['id']) => void;
  handleEdit: (roleId: Role['id']) => void;
}

const RoleTable = ({
  title,
  captions,
  data,
  handleDelete,
  handleEdit,
}: Props) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Card bg={bg} overflowX={{ sm: 'scroll' }} borderRadius={15}>
      <CardHeader p="6px 0px 22px 0px">
        <Text fontSize="xl" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody maxHeight="400px" overflow="auto">
        <Table size={'sm'} variant="simple" color={textColor}>
          <Thead>
            <Tr whiteSpace={'nowrap'} my=".8rem" pl="0px" color="gray.400">
              {captions.map((caption, idx) => {
                if (idx === 0) {
                  return (
                    <MyTh
                      position={'sticky'}
                      left={0}
                      zIndex={2}
                      bg="white"
                      key={idx}
                    >
                      {caption}
                    </MyTh>
                  );
                }
                return <MyTh key={idx}>{caption}</MyTh>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((row) => {
                return (
                  <TableRoleRow
                    key={row.id}
                    roleName={row.roleName}
                    description={row.description}
                    root={row.root}
                    createdAt={row.createdAt}
                    handleDelete={() => handleDelete(row.id)}
                    handleEdit={() => handleEdit(row.id)}
                  />
                );
              })
            ) : (
              <Tr>
                <Td textAlign={'center'} color="gray.400" colSpan={5}>
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

const AdminRoleListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const [roles, setRoles] = useState<Role[] | null>(null);
  const [roleSelected, setRoleSelected] = useState<Role['id'] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    getAdminRoles()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const roles = normalizeAdminRole(res.payload);
          setRoles(roles);
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
    router.push('/admin/role/create');
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const handleDelete = (roleId: Role['id']) => {
    onOpen();
    setRoleSelected(roleId);
  };

  const handleDeleteRole = () => {
    if (!roleSelected) return;
    setLoading(true);
    deleteAdminRole(roleSelected)
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

  const handleEdit = (roleId: Role['id']) => {
    router.push(`/admin/role/${roleId}`);
  };

  return (
    <>
      <Flex align="center" justify="end" mb="20px">
        {ability.can('ROLE', ability.permissions.CREATE_AUTH_ROLE) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <RoleTable
        title={'Role List'}
        captions={['Role name', 'Description', 'Permission', 'Create date', '']}
        data={roles || []}
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
                onClick={handleDeleteRole}
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

export default AdminRoleListing;
