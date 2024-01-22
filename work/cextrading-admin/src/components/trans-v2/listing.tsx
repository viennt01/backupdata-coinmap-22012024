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
  Select,
} from '@chakra-ui/react';
// Custom components
import { HiDownload, HiSearch } from 'react-icons/hi';

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import TableTransactionRow from './table-row';

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  listTransaction,
  normalizeTransactionExport,
  normalizeTransactionList,
  ParamsTransactionList,
  getMerchantCode,
  getBotSignal,
  getRoles,
  getBotTrading,
} from './fetcher';
import {
  Transaction,
  TRANSACTION_STATUS,
  TRANSACTION_CATEGORY,
  FILTER,
} from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import { exportCsv, MyTh } from 'components/tables';
import useToastHook, { STATUS } from 'components/hook/toast';
import { useBgWhite } from 'components/hook';
import Pagination from 'components/pagination';
import { FILTER_DEFAULT } from 'constants/index';
import { format, startOfDay, endOfDay, startOfMonth } from 'date-fns';
import useMyAbility from 'hook/ability';

interface Props {
  title: string;
  captions: string[];
  data: Transaction[];
  filter: FILTER;
  handleTransactionDetail: (id: Transaction['id']) => void;
  handleChangePage: (page: FILTER['page']) => void;
  handleChangeSize: (page: FILTER['size']) => void;
  total: number;
  totalPage: number;
}

const TransactionTable = ({
  title,
  captions,
  data,
  filter,
  handleTransactionDetail,
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
      <CardBody maxHeight="50vh" overflow="auto">
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
              data.map((transaction: Transaction) => {
                return (
                  <TableTransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    handleTransactionDetail={() =>
                      handleTransactionDetail(transaction.id)
                    }
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
  keyword: '',
  status: TRANSACTION_STATUS.STATUS,
  category: TRANSACTION_CATEGORY.ORDER_TYPE,
  merchant_code: '',
  name: '',
  from: startOfMonth(Date.now()).valueOf(),
  to: endOfDay(Date.now()).valueOf(),
};

const TransactionListing = () => {
  const router = useRouter();
  const toast = useToastHook();

  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<FILTER>(initFilter);
  const [totalPage, setTotalPage] = useState<number>(FILTER_DEFAULT.totalPage);
  const [total, setTotal] = useState<number>(FILTER_DEFAULT.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionListing, setTransactionListing] = useState<
    Transaction[] | null
  >(null);
  const [exportDisabled, setExportDisabled] = useState<boolean>(true);
  const [listMerchantCode, setListMerchantCode] = useState<string[]>([]);
  const [listPkg, setListPkg] = useState<string[]>([]);
  const [listNameSBot, setListNameSBot] = useState<string[]>([]);
  const [listNameTBot, setListNameTBot] = useState<string[]>([]);
  const [listNameOption, setListNameOption] = useState<string[]>([]);

  const ability = useMyAbility();

  const fetchData = (filter: FILTER) => {
    const rawFilter: ParamsTransactionList = {
      page: filter.page,
      size: filter.size,
      keyword: filter.keyword || '',
      status: filter.status === TRANSACTION_STATUS.STATUS ? '' : filter.status,
      category:
        filter.category === TRANSACTION_CATEGORY.ORDER_TYPE
          ? ''
          : filter.category,
      merchant_code: filter.merchant_code,
      name: filter.name,
      from: filter.from,
      to: filter.to,
    };
    setLoading(true);
    listTransaction(rawFilter)
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const res = normalizeTransactionList(rawRes.payload);
          setTransactionListing(res.rows);
          setTotalPage(Math.ceil(res.total / res.size));
          setTotal(res.total);
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
  };

  const fetchDataMerchantCode = () => {
    getMerchantCode().then((code) => {
      const merchantCode = code.payload.map((item) => {
        return item.code;
      });
      setListMerchantCode(['MERCHANT'].concat(merchantCode).filter(Boolean));
    });
  };

  const fetchDataNameRole = () => {
    getRoles().then((code) => {
      const nameRole = code.payload.map((item) => {
        return item.role_name;
      });
      setListPkg(['NAME'].concat(nameRole).filter(Boolean));
    });
  };

  const fetchDataName = () => {
    getBotSignal().then((code) => {
      const nameSBot = code.payload.map((item) => {
        return item.name;
      });
      setListNameSBot(['NAME'].concat(nameSBot).filter(Boolean));
    });
  };

  const fetchDataBotTrading = () => {
    getBotTrading().then((code) => {
      const nameTBot = code.payload.map((item) => {
        return item.name;
      });
      setListNameTBot(['NAME'].concat(nameTBot).filter(Boolean));
    });
  };

  const filterName = () => {
    switch (filter.category) {
      case 'PKG':
        setListNameOption(listPkg);
        break;
      case 'SBOT':
        setListNameOption(listNameSBot);
        break;
      case 'TBOT':
        setListNameOption(listNameTBot);
        break;
      default:
        setListNameOption(['NAME']);
    }
  };

  useEffect(() => {
    fetchData(filter);
    fetchDataMerchantCode();
    fetchDataName();
    fetchDataNameRole();
    fetchDataBotTrading();
    filterName();
  }, [filter]);

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
  const onChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    if (target.value === TRANSACTION_STATUS.STATUS) {
      setFilter((prev) => ({ ...prev, status: '' }));
    } else {
      setFilter((prev) => ({ ...prev, status: target.value }));
    }
  };
  const onChangeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    if (target.value === TRANSACTION_CATEGORY.ORDER_TYPE) {
      setFilter((prev) => ({ ...prev, category: '' }));
    } else {
      setFilter((prev) => ({ ...prev, category: target.value }));
    }
  };
  const onChangeMerchantCode = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const target = event.target;
    if (target.value === 'MERCHANT') {
      setFilter((prev) => ({ ...prev, merchant_code: '' }));
    } else {
      setFilter((prev) => ({ ...prev, merchant_code: target.value }));
    }
  };
  const onChangeName = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    if (target.value === 'NAME') {
      setFilter((prev) => ({ ...prev, name: '' }));
    } else {
      setFilter((prev) => ({ ...prev, name: target.value }));
    }
  };
  const handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = startOfDay(new Date(event.target.value).valueOf()).valueOf();
    setFilter((prev) => ({ ...prev, from: time }));
  };
  const handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = endOfDay(new Date(event.target.value).valueOf()).valueOf();
    setFilter((prev) => ({ ...prev, to: time }));
  };
  const handleTransactionDetail = (id: Transaction['id']) => {
    router.push(`/trans-v2/${id}`);
  };
  function exportTransaction() {
    const rawFilter: ParamsTransactionList = {
      page: 1,
      size: total,
      keyword: filter.keyword || '',
      status: filter.status === TRANSACTION_STATUS.STATUS ? '' : filter.status,
      category:
        filter.category === TRANSACTION_CATEGORY.ORDER_TYPE
          ? ''
          : filter.category,
      merchant_code: filter.merchant_code,
      name: filter.name,
      from: filter.from,
      to: filter.to,
    };
    listTransaction(rawFilter)
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const rows = rawRes.payload.rows.map((row) =>
            normalizeTransactionExport(row),
          );
          const headerCsv = [
            {
              name: 'Transaction ID',
              value: 'id',
            },
            {
              name: 'Payment ID',
              value: 'paymentId',
            },
            {
              name: 'Order Id',
              value: 'orderId',
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
              name: 'Amount',
              value: 'amount',
            },
            {
              name: 'Currency',
              value: 'currency',
            },
            {
              name: 'Merchant code',
              value: 'merchantCode',
            },
            {
              name: 'Category',
              value: 'category',
            },
            {
              name: 'Name',
              value: 'name',
            },
            {
              name: 'Status',
              value: 'status',
            },
            {
              name: 'Time',
              value: 'createdAt',
            },
          ];
          exportCsv(
            rows,
            headerCsv,
            `transaction_from_${format(filter.from, 'yyyy-MM-dd')}_to_${format(
              filter.to,
              'yyyy-MM-dd',
            )}.csv`,
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
  const statusOptions = Object.values(TRANSACTION_STATUS);
  const categoryOptions = Object.values(TRANSACTION_CATEGORY);
  const checkDisableName = listNameOption.length === 1 ? true : false;
  return (
    <>
      <Head>
        <title>COINMAP ADMIN | TRANSACTION LISTING</title>
      </Head>

      <Flex align="center" justifyContent="left" mb="20px">
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
        <Flex ml="1">
          <Select onChange={onChangeStatus} backgroundColor="white">
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex ml="1">
          <Select onChange={onChangeCategory} backgroundColor="white">
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex ml="1">
          <Select
            onChange={onChangeName}
            backgroundColor="white"
            disabled={checkDisableName}
          >
            {listNameOption.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex ml="1">
          <Select onChange={onChangeMerchantCode} backgroundColor="white">
            {listMerchantCode.map((merchantCode) => (
              <option key={merchantCode} value={merchantCode}>
                {merchantCode}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex ml="5" align="center">
          From:
          <Input
            onChange={handleChangeFrom}
            bg={bgWhite}
            type="date"
            value={format(filter.from, 'yyyy-MM-dd')}
          />
        </Flex>
        <Flex ml="1" align="center">
          To:
          <Input
            onChange={handleChangeTo}
            bg={bgWhite}
            type="date"
            value={format(filter.to, 'yyyy-MM-dd')}
          />
        </Flex>
        {ability.can('ROLE', ability.permissions.EXPORT_TRANSACTION) && (
          <Flex ml="1" align="center">
            <Button
              disabled={exportDisabled}
              bg="teal.300"
              rightIcon={<HiDownload />}
              onClick={exportTransaction}
            >
              Export
            </Button>
          </Flex>
        )}
      </Flex>
      <TransactionTable
        title={'Transaction Listing'}
        captions={[
          'Order Id',
          'Amount',
          'Merchant code',
          'Order type',
          'Name',
          'Status',
          'Fullname',
          'Email',
          'Create Date',
          '',
        ]}
        data={transactionListing || []}
        filter={filter}
        handleChangePage={handleChangePage}
        handleChangeSize={handleChangeSize}
        handleTransactionDetail={handleTransactionDetail}
        totalPage={totalPage}
        total={total}
      />
    </>
  );
};

export default TransactionListing;
