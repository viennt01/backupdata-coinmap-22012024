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
import { HiCheckCircle, HiPlus } from 'react-icons/hi';

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getRoles,
  normalizeRole,
  deleteRole,
  updateOrderRole,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { Role, UpdateOrderRole } from './interface';
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
  handleEditing: (roleId: Role['id']) => void;
  changeOrder: (index: number, orderChange: 1 | -1) => void;
}

const RoleTable = ({
  title,
  captions,
  data,
  handleDelete,
  handleEditing,
  changeOrder,
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
        <Table size={'sm'} variant="simple" color={textColor}>
          <Thead>
            <Tr my=".8rem" pl="0px" color="gray.400">
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
              data.map((row, index) => {
                return (
                  <TableRoleRow
                    key={row.id}
                    index={index}
                    id={row.id}
                    roleName={row.roleName}
                    description={row.description}
                    root={row.root}
                    createdAt={row.createdAt}
                    handleDelete={() => handleDelete(row.id)}
                    handleEditing={() => handleEditing(row.id)}
                    changeOrder={changeOrder}
                    type={row.type}
                    price={row.price}
                    currency={row.currency}
                    status={row.status}
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

const UserRoleListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const [roles, setRoles] = useState<Role[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [roleIdSelected, setRoleIdSeleted] = useState<Role['id'] | null>(null);
  const [isOrderChange, setIsOrderChange] = useState<boolean>(true);

  const fetchData = () => {
    getRoles()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const roles = normalizeRole(res.payload);
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

  function changeOrder(index: number, orderChange: 1 | -1) {
    if (roles) {
      const tempRoles = [...roles];
      const tempOrder = tempRoles[index].order;
      if (orderChange === 1) {
        if (index === 0) {
          tempRoles[index].order = tempRoles[roles.length - 1].order;
          tempRoles[roles.length - 1].order = tempOrder;
        } else {
          tempRoles[index].order = tempRoles[index - 1].order;
          tempRoles[index - 1].order = tempOrder;
        }
      } else {
        if (index === roles.length - 1) {
          tempRoles[index].order = tempRoles[0].order;
          tempRoles[0].order = tempOrder;
        } else {
          tempRoles[index].order = tempRoles[index + 1].order;
          tempRoles[index + 1].order = tempOrder;
        }
      }
      tempRoles.sort((a, b) => a.order - b.order);
      setRoles(tempRoles);
      setIsOrderChange(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    router.push('/user/role/create');
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const handleDelete = (roleId: Role['id']) => {
    onOpen();
    setRoleIdSeleted(roleId);
  };

  const handleDeleteRole = () => {
    if (!roleIdSelected) return;
    setLoading(true);
    deleteRole(roleIdSelected)
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

  const handleEditRole = () => {
    if (!roles) {
      return;
    }
    // edit role // edit feature role
    const newRoles: UpdateOrderRole[] = roles.map((e) => {
      return {
        id: e.id,
        order: e.order,
      };
    });
    return updateOrderRole({ roles: newRoles })
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          fetchData();
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
        setIsOrderChange(true);
      });
  };

  const handleEditing = (roleId: Role['id']) => {
    router.push(`/user/role/${roleId}`);
  };
  return (
    <>
      <Flex align="center" justify="end" mb="20px">
        {ability.can('ROLE', ability.permissions.CREATE_ROLE) && (
          <Button
            bg="teal.300"
            mr={5}
            disabled={isOrderChange}
            rightIcon={<HiCheckCircle />}
            onClick={handleEditRole}
          >
            Save Change
          </Button>
        )}
        {ability.can('ROLE', ability.permissions.CREATE_ROLE) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <RoleTable
        title={'Role List'}
        captions={[
          'Role name',
          'Description',
          'Type',
          'Price',
          'Currency',
          'Status',
          'General',
          'Features',
          'Exchange',
          'Symbol',
          'Resolution',
          'Create date',
          '',
        ]}
        data={roles || []}
        handleDelete={handleDelete}
        handleEditing={handleEditing}
        changeOrder={changeOrder}
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

export default UserRoleListing;
