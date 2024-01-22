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
import { HiPlus, HiSearch } from 'react-icons/hi';

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import TablesTableRow from './table-row';

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAdmins, normalizeAdminList, ParamsAdminList } from './fetcher';
import { AdminList, FILTER, USER_TYPE } from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import { MyTh } from 'components/tables';
import useToastHook, { STATUS } from 'components/hook/toast';
import { useBgWhite } from 'components/hook';
import Pagination from 'components/pagination';
import { FILTER_DEFAULT } from 'constants/index';
import useMyAbility from 'hook/ability';

interface Props {
  title: string;
  captions: string[];
  data: AdminList[];
  handleEditing: (adminId: AdminList['id']) => void;
  filter: FILTER;
  handleChangePage: (page: FILTER['page']) => void;
  handleChangeSize: (page: FILTER['size']) => void;
  total: number;
  totalPage: number;
}

const AdminTable = ({
  title,
  captions,
  data,
  handleEditing,
  filter,
  handleChangePage,
  handleChangeSize,
  totalPage,
  total,
}: Props) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Card bg={bg} borderRadius={15} overflowX={{ sm: 'scroll' }}>
      <CardHeader p="6px 0px 22px 0px">
        <Text fontSize="xl" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody maxHeight="400px" overflow="auto">
        <Table size={'sm'} variant="simple" color={textColor}>
          <Thead>
            <Tr whiteSpace={'nowrap'} my=".8rem" color="gray.400">
              {captions.map((caption, idx) => {
                return <MyTh key={idx}>{caption}</MyTh>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((admin: AdminList) => {
                return (
                  <TablesTableRow
                    key={admin.id}
                    admin={admin}
                    handleEditing={() => handleEditing(admin.id)}
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
  userType: USER_TYPE.ADMIN,
};

const AdminListing = () => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<FILTER>(initFilter);
  const [totalPage, setTotalPage] = useState<number>(FILTER_DEFAULT.totalPage);
  const [total, setTotal] = useState<number>(FILTER_DEFAULT.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [adminListing, setAdminListing] = useState<AdminList[] | null>(null);

  const handleCreate = () => {
    router.push('/admin/create');
  };

  const fetchData = (filter: FILTER) => {
    const rawFilter: ParamsAdminList = {
      page: filter.page,
      size: filter.size,
      keyword: filter.keyword || '',
      user_type: filter.userType,
    };
    setLoading(true);
    getAdmins(rawFilter)
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const res = normalizeAdminList(rawRes.payload);
          setAdminListing(res.rows);
          setTotalPage(Math.ceil(res.total / res.size));
          setTotal(res.total);
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

  const handleEditing = (adminId: AdminList['id']) => {
    router.push(`/admin/${adminId}`);
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilter((prev) => ({ ...prev, keyword: inputRef.current?.value }));
  };

  const handleChangePage = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const handleChangeSize = (size: number) => {
    setFilter((prev) => ({ ...prev, size, page: FILTER_DEFAULT.page }));
  };
  const bgWhite = useBgWhite();

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | ADMIN LISTING</title>
      </Head>

      <Flex align="center" justifyContent="space-between" mb="20px">
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

        {ability.can('ROLE', ability.permissions.CREATE_ADMIN) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <AdminTable
        title={'Admin Listing'}
        captions={[
          'Username',
          'Address',
          'Email',
          'Phone',
          'Role',
          'Status',
          'Date create',
          '',
        ]}
        data={adminListing || []}
        handleEditing={handleEditing}
        filter={filter}
        handleChangePage={handleChangePage}
        handleChangeSize={handleChangeSize}
        totalPage={totalPage}
        total={total}
      />
    </>
  );
};

export default AdminListing;
