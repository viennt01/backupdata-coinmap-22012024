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
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
// Custom components
import { HiDownload, HiPlus, HiSearch } from 'react-icons/hi';

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getUsers,
  ParamUserList,
  normalizeUserList,
  getAllUsers,
  normalizeListingUser,
  normalizeExportUser,
} from './fetcher';
import { FILTER, UserList, USER_TYPE } from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import TableRoleRow from './table-row';
import { exportCsv, MyTh } from 'components/tables';
import useToastHook, { STATUS } from 'components/hook/toast';
import { useBgWhite } from 'components/hook';
import Pagination from 'components/pagination';
import { FILTER_DEFAULT } from 'constants/index';
import useMyAbility from 'hook/ability';
import UpdateMultipleForm from './update-multiple-form';
import CheckboxField from 'components/form/checkbox-field';
import { format } from 'date-fns';
import Select, { MultiValue } from 'react-select';
import { getRoles, normalizeRole } from '../role/fetcher';

interface Props {
  title: string;
  captions: string[];
  data: UserList[];
  handleEditing: (roleId: UserList['id']) => void;
  filter: FILTER;
  handleChangePage: (page: FILTER['page']) => void;
  handleChangeSize: (size: FILTER['size']) => void;
  total: number;
  totalPage: number;
  handleCheckUser: (id: string, checked: boolean) => void;
  handleCheckAll: (checked: boolean) => void;
  totalChecked: number;
  checkedAll: boolean;
}

const UserTable = ({
  title,
  captions,
  data,
  handleEditing,
  filter,
  handleChangePage,
  totalPage,
  total,
  handleChangeSize,
  handleCheckUser,
  handleCheckAll,
  totalChecked,
  checkedAll,
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
                if (idx === 0) {
                  return (
                    <MyTh key={idx} zIndex={0}>
                      <CheckboxField
                        isChecked={checkedAll}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleCheckAll(true);
                          } else {
                            handleCheckAll(false);
                          }
                        }}
                      >
                        {totalChecked || ''}
                        {caption}
                      </CheckboxField>
                    </MyTh>
                  );
                }
                return (
                  <MyTh key={idx} zIndex={0}>
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
                  <TableRoleRow
                    key={row.id}
                    user={row}
                    handleEditing={() => handleEditing(row.id)}
                    handleCheckUser={handleCheckUser}
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
      <Pagination
        handleChangePage={handleChangePage}
        handleChangeSize={handleChangeSize}
        page={filter.page}
        size={filter.size}
        total={total}
        totalPage={totalPage}
      />
    </Card>
  );
};

const initFilter: FILTER = {
  page: FILTER_DEFAULT.page,
  size: FILTER_DEFAULT.size,
  userType: USER_TYPE.USER,
  roleNames: [],
};

const UserListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const [filter, setFilter] = useState<FILTER>(initFilter);
  const [userListing, setUserListing] = useState<UserList[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(FILTER_DEFAULT.totalPage);
  const [total, setTotal] = useState<number>(FILTER_DEFAULT.total);
  const [usersSelected, setUsersSelected] = useState<
    { value: string; label: string }[]
  >([]);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [updatedMultiple, setUpdatedMultiple] = useState<boolean>(true);
  const [allUser, setAllUser] = useState<UserList[] | null>(null);
  const [userOptions, setUserOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [emailInputChange, setEmailInputChange] = useState<boolean>(false);
  const [exportDisabled, setExportDisabled] = useState<boolean>(true);
  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const fetchData = (filter: FILTER) => {
    const rawFilter: ParamUserList = {
      page: filter.page,
      size: filter.size,
      keyword: filter.keyword || '',
      user_type: filter.userType,
    };
    if (filter.roleNames.length > 0) {
      rawFilter.roles = filter.roleNames.join(',');
    }
    setLoading(true);
    getUsers(rawFilter)
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const res = normalizeUserList(rawRes.payload, usersSelected);
          setUserListing(res.rows);
          setTotalPage(Math.ceil(res.total / res.size));
          setTotal(res.total);
          const checkedAll = res.rows.every((u) => u.checked);
          setCheckedAll(checkedAll);
          if (res.rows.length > 0) {
            setExportDisabled(false);
          } else {
            setExportDisabled(true);
          }
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
    getAllUsers({})
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const options: { value: string; label: string }[] = [];
          const rows = rawRes.payload.map((u) => {
            const user = normalizeListingUser(u, true);
            options.push({
              value: user.id,
              label: user.email,
            });
            return user;
          });
          setAllUser(rows);
          setUserOptions(options);
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
    getRoles()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const roles = normalizeRole(res.payload);
          const roleOptions = roles?.map((r) => ({
            value: r.id,
            label: r.roleName,
          }));
          setRoleOptions(roleOptions);
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
    fetchData(filter);
  }, [filter]);

  useEffect(() => {
    if (updatedMultiple === true) {
      fetchData(filter);
      setUpdatedMultiple(false);
    }
  }, [updatedMultiple]);

  const handleCreate = () => {
    router.push('/user/users/create');
  };

  const handleEditing = (userId: UserList['id']) => {
    router.push(`/user/users/${userId}`);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilter((prev) => ({
      ...prev,
      keyword: inputRef.current?.value?.trim(),
    }));
  };

  const handleChangePage = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const handleChangeSize = (size: number) => {
    setFilter((prev) => ({ ...prev, size, page: FILTER_DEFAULT.page }));
  };

  const handleCheckUser = (id: string, checked: boolean) => {
    if (allUser) {
      if (userListing) {
        const userListingTeamp = [...userListing];
        const index = userListingTeamp.findIndex((u) => u.id === id);
        if (index > -1) {
          userListingTeamp[index].checked = checked;
          setUserListing(userListingTeamp);
        }
        const checkedAll = userListingTeamp.every((u) => u.checked);
        setCheckedAll(checkedAll);
      }
      const user = allUser.find((u) => u.id === id);
      if (user) {
        const userSelectedTemp = [...usersSelected];
        if (checked) {
          userSelectedTemp.push({
            value: user.id,
            label: user.email,
          });
        } else {
          const index = userSelectedTemp.findIndex((u) => u.value === id);
          if (index > -1) {
            userSelectedTemp.splice(index, 1);
          }
        }
        setUsersSelected(userSelectedTemp);
      }
    }
  };
  const handleCheckAll = (checked: boolean) => {
    setCheckedAll(checked);
    if (userListing) {
      const userListingTeamp = [...userListing];
      const userSelectedTemp = [...usersSelected];
      if (checked) {
        userListingTeamp.map((u) => {
          u.checked = checked;
          if (!userSelectedTemp.find((usl) => usl.value === u.id)) {
            userSelectedTemp.push({
              value: u.id,
              label: u.email,
            });
          }
          return u;
        });
      } else {
        userListingTeamp.map((u) => {
          u.checked = checked;
          const index = userSelectedTemp.findIndex((usl) => usl.value === u.id);
          userSelectedTemp.splice(index, 1);
          return u;
        });
      }
      setUserListing(userListingTeamp);
      setUsersSelected(userSelectedTemp);
    }
  };

  const handleSelectRoles = (
    option: MultiValue<{ value: string; label: string }>,
  ) => {
    const roleNames = option.map((o) => o.label);
    setFilter((prev) => ({ ...prev, roleNames }));
  };

  useEffect(() => {
    if (userListing && !emailInputChange && usersSelected) {
      const userListingTeamp = [...userListing];
      const newUserListing = userListingTeamp.map((u) => {
        const check = usersSelected.find((usl) => usl.value === u.id);
        if (check) {
          u.checked = true;
        } else {
          u.checked = false;
        }
        return u;
      });
      setUserListing(newUserListing);
      const checkedAll = newUserListing.every((u) => u.checked);
      setCheckedAll(checkedAll);
    }
  }, [emailInputChange]);

  function exportUser() {
    const rawFilter: ParamUserList = {
      page: 1,
      size: total,
      keyword: filter.keyword || '',
      user_type: filter.userType,
    };
    if (filter.roleNames.length > 0) {
      rawFilter.roles = filter.roleNames.join(',');
    }
    getUsers(rawFilter)
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const rows = rawRes.payload.rows.map((row) =>
            normalizeExportUser(row),
          );
          const headerCsv = [
            {
              name: 'ID',
              value: 'id',
            },
            {
              name: 'Fullname',
              value: 'fullname',
            },
            {
              name: 'Email',
              value: 'email',
            },
            {
              name: 'Phone',
              value: 'phone',
            },
            {
              name: 'Address',
              value: 'address',
            },
            {
              name: 'Roles',
              value: 'roles',
            },
            {
              name: 'Status',
              value: 'active',
            },
            {
              name: 'Email confirmed',
              value: 'emailConfirmed',
            },
            {
              name: 'Time',
              value: 'createdAt',
            },
          ];
          exportCsv(
            rows,
            headerCsv,
            `users${format(Date.now(), 'yyyy-MM-dd_HH-mm')}.csv`,
          );
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  }

  const bgWhite = useBgWhite();

  return (
    <div>
      <Flex align="center" justifyContent="space-between" mb="20px">
        <Flex align="center" justify="left" mb="20px">
          <form onSubmit={handleSearch}>
            <InputGroup>
              <Input
                ref={inputRef}
                bg={bgWhite}
                type="tel"
                placeholder="Enter search"
              />
              <InputRightElement>
                <Button
                  borderTopRightRadius={'0.375rem'}
                  borderBottomRightRadius="0.375rem"
                  bg="teal.300"
                  p="0"
                  borderRadius={0}
                  type="submit"
                  isLoading={loading}
                >
                  <HiSearch width={'24px'} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
          <div style={{ minWidth: '200px', marginLeft: '10px' }}>
            <Select
              closeMenuOnSelect={true}
              isMulti
              options={roleOptions}
              onChange={(e) => e && handleSelectRoles(e)}
            />
          </div>
        </Flex>
        <Flex align="center" justify="end" mb="20px">
          {ability.can('ROLE', ability.permissions.UPDATE_USER) && (
            <UpdateMultipleForm
              usersSelected={usersSelected}
              handleCheckUser={handleCheckUser}
              setUpdatedMultiple={setUpdatedMultiple}
              userOptions={userOptions}
              setUsersSelected={setUsersSelected}
              setEmailInputChange={setEmailInputChange}
              emailInputChange={emailInputChange}
              roleOptions={roleOptions}
            />
          )}
          {ability.can('ROLE', ability.permissions.CREATE_USER) && (
            <Button
              bg="teal.300"
              marginLeft={3}
              rightIcon={<HiPlus />}
              onClick={handleCreate}
            >
              Create
            </Button>
          )}
          {ability.can('ROLE', ability.permissions.EXPORT_USER) && (
            <Flex ml="1" align="center">
              <Button
                disabled={exportDisabled}
                bg="teal.300"
                rightIcon={<HiDownload />}
                onClick={exportUser}
              >
                Export
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
      <div>
        <UserTable
          title={'User List'}
          captions={[
            'User name',
            'Adress',
            'Email',
            'Phone',
            'Role',
            'Status',
            'Email verify',
            'Create date',
            '',
          ]}
          data={userListing || []}
          handleEditing={handleEditing}
          filter={filter}
          handleChangePage={handleChangePage}
          handleChangeSize={handleChangeSize}
          totalPage={totalPage}
          total={total}
          handleCheckUser={handleCheckUser}
          handleCheckAll={handleCheckAll}
          totalChecked={usersSelected.length}
          checkedAll={checkedAll}
        />
      </div>
    </div>
  );
};

export default UserListing;
