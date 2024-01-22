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
import Head from 'next/head';
import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';
import SelectMulti, { MultiValue } from 'react-select';

import React, { useEffect, useRef, useState } from 'react';
import { ERROR_CODE } from 'fetcher/interface';
import TableRow from './table-row';
import { MyTh } from 'components/tables';
import useToastHook, { STATUS } from 'components/hook/toast';
import { FILTER, TBotSystemTradeHistory } from './interface';
import {
  getTBotSystemTradeHistory,
  normalizeTBotSystemTradeHistoryList,
  ParamTBotSystemTradeHistoryList,
} from './fetcher';
import { FILTER_DEFAULT } from 'constants/index';
import { format, startOfDay, endOfDay } from 'date-fns';
import Pagination from 'components/pagination';
import { useBgWhite } from 'components/hook';
import { HiChevronDown, HiChevronUp, HiSearch } from 'react-icons/hi';
import {
  getSymbols,
  normalizeSymbol,
} from 'components/settings/symbol/fetcher';
import {
  getResolutions,
  normalizeResolution,
} from 'components/settings/resolution/fetcher';
import { getListBots, normalizeBot } from '../tbot/fetcher';

interface Props {
  title: string;
  captions: string[];
  data: TBotSystemTradeHistory[];
  filter: FILTER;
  handleChangePage: (page: FILTER['page']) => void;
  handleChangeSize: (page: FILTER['size']) => void;
  total: number;
  totalPage: number;
  changeSort: (sortBy: string, orderBy: 'desc' | 'asc') => void;
}

const timeFormDefault = new Date();
timeFormDefault.setDate(timeFormDefault.getDate() - 7);
const initFilter: FILTER = {
  page: FILTER_DEFAULT.page,
  size: FILTER_DEFAULT.size,
  keyword: '',
  symbols: [],
  resolutions: [],
  sortBy: 'open_time',
  orderBy: 'desc',
  from: startOfDay(timeFormDefault).valueOf(),
  to: endOfDay(Date.now()).valueOf(),
  positionSide: '',
  nameBots: ['Beyond8'],
};
const SystemTradeHistoryTable = ({
  title,
  captions,
  data,
  filter,
  handleChangePage,
  handleChangeSize,
  totalPage,
  total,
  changeSort,
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
                return (
                  <MyTh key={idx} zIndex={0}>
                    <Flex alignItems={'center'} gap="12px">
                      {caption}
                      <Flex flexDirection="column">
                        <HiChevronUp
                          size={15}
                          cursor="pointer"
                          onClick={() => changeSort(caption, 'desc')}
                        />
                        <HiChevronDown
                          size={15}
                          cursor="pointer"
                          onClick={() => changeSort(caption, 'asc')}
                        />
                      </Flex>
                    </Flex>
                  </MyTh>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((row) => {
                return <TableRow key={row.orderId} trade={row} />;
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

const TBotSystemTradeHistoryListing = (): JSX.Element => {
  const toast = useToastHook();

  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<FILTER>(initFilter);
  const [totalPage, setTotalPage] = useState<number>(FILTER_DEFAULT.totalPage);
  const [total, setTotal] = useState<number>(FILTER_DEFAULT.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [symbolOptions, setSymbolOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [tbotOptions, setTbotOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [resolutionOptions, setResolutionOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [trades, setTrades] = useState<TBotSystemTradeHistory[] | null>(null);

  const handleChangePage = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const handleChangeSize = (size: number) => {
    setFilter((prev) => ({ ...prev, size, page: FILTER_DEFAULT.page }));
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilter((prev) => ({
      ...prev,
      keyword: inputRef.current?.value?.trim(),
    }));
  };

  const handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = startOfDay(new Date(event.target.value).valueOf()).valueOf();
    setFilter((prev) => ({ ...prev, from: time }));
  };
  const handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = endOfDay(new Date(event.target.value).valueOf()).valueOf();
    setFilter((prev) => ({ ...prev, to: time }));
  };

  const handleSelectSymbol = (
    option: MultiValue<{ value: string; label: string }>,
  ) => {
    const symbols = option.map((o) => o.label);
    setFilter((prev) => ({ ...prev, symbols }));
  };

  const handleSelectResolution = (
    option: MultiValue<{ value: string; label: string }>,
  ) => {
    const resolutions = option.map((o) => o.label);
    setFilter((prev) => ({ ...prev, resolutions }));
  };

  const handleSelectTbotName = (
    option: MultiValue<{ value: string; label: string }>,
  ) => {
    const nameBots = option.map((o) => o.value);
    setFilter((prev) => ({ ...prev, nameBots }));
  };

  const handleChangePositionSide = (event: any) => {
    const target = event.target;
    if (target.value === 'POSITION_SIDE') {
      setFilter((prev) => ({ ...prev, positionSide: '' }));
    } else {
      setFilter((prev) => ({ ...prev, positionSide: target.value }));
    }
  };
  const handleChangeSort = (sortBy: string, orderBy: 'desc' | 'asc') => {
    sortBy = sortBy.toLowerCase().replaceAll(' ', '_');

    setFilter((prev) => ({ ...prev, sortBy, orderBy }));
  };
  const fetchData = (filter: FILTER) => {
    const rawFilter: ParamTBotSystemTradeHistoryList = {
      page: filter.page,
      size: filter.size,
      keyword: filter.keyword || '',
      from: filter.from,
      to: filter.to,
      order_by: filter.orderBy,
      sort_by: filter.sortBy,
      position_side: filter.positionSide,
    };
    if (filter.symbols && filter.symbols.length > 0) {
      rawFilter.symbols = filter.symbols.join(',');
    }
    if (filter.resolutions && filter.resolutions.length > 0) {
      rawFilter.resolutions = filter.resolutions.join(',');
    }
    if (filter.nameBots && filter.nameBots.length > 0) {
      rawFilter.name_bots = filter.nameBots.join(',');
    }
    setLoading(true);
    getTBotSystemTradeHistory(rawFilter)
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const res = normalizeTBotSystemTradeHistoryList(rawRes.payload);
          setTrades(res.rows);
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

  const fetchTBotListData = () => {
    getListBots()
      .then((rawRes) => {
        if (rawRes.error_code === ERROR_CODE.SUCCESS) {
          const res = rawRes.payload.map((row) => {
            return normalizeBot(row);
          });
          setTbotOptions(
            (res || []).map((tbot) => ({
              value: tbot.name,
              label: tbot.name,
            })),
          );
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
    fetchTBotListData();
  }, []);

  useEffect(() => {
    console.log('filter', filter);
    fetchData(filter);
  }, [filter]);
  useEffect(() => {
    getSymbols()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const symbols = normalizeSymbol(res.payload);
          const symbolOptions: { value: string; label: string }[] = [];
          symbols.forEach((e) => {
            if (e.symbol) {
              symbolOptions.push({ value: e.symbol, label: e.symbol });
            }
          });
          setSymbolOptions(symbolOptions);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });

    getResolutions()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const resolutions = normalizeResolution(res.payload);
          const resolutionOptions: { value: string; label: string }[] = [];
          resolutions.forEach((e) => {
            if (e.displayName) {
              resolutionOptions.push({
                value: e.displayName,
                label: e.displayName,
              });
            }
          });
          setResolutionOptions(resolutionOptions);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  }, []);
  const positionSideOptions = ['POSITION_SIDE', 'LONG', 'SHORT'];
  const bgWhite = useBgWhite();
  return (
    <div>
      <Head>
        <title>COINMAP ADMIN | SYSTEM TRADE HISTORY</title>
      </Head>
      <Flex
        align="center"
        justifyContent="left"
        mb="20px"
        gap={'12px'}
        flexWrap={'wrap'}
      >
        <form
          onSubmit={handleSearch}
          style={{ minWidth: '200px', marginLeft: '10px' }}
        >
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
          <SelectMulti
            placeholder="Symbols"
            closeMenuOnSelect={true}
            isMulti
            options={symbolOptions}
            onChange={(e) => e && handleSelectSymbol(e)}
          />
        </div>
        <div style={{ minWidth: '200px', marginLeft: '10px' }}>
          <SelectMulti
            placeholder="Resolutions"
            closeMenuOnSelect={true}
            isMulti
            options={resolutionOptions}
            onChange={(e) => e && handleSelectResolution(e)}
          />
        </div>
        <div style={{ minWidth: '200px', marginLeft: '10px' }}>
          <Select onChange={handleChangePositionSide} backgroundColor="white">
            {positionSideOptions.map((side) => {
              return (
                <option key={side} value={side}>
                  {side}
                </option>
              );
            })}
          </Select>
        </div>
        <div style={{ minWidth: '200px', marginLeft: '10px' }}>
          <SelectMulti
            placeholder="Bot name"
            closeMenuOnSelect={true}
            isMulti
            options={tbotOptions}
            onChange={(e) => e && handleSelectTbotName(e)}
          />
        </div>
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
      </Flex>
      <div>
        <SystemTradeHistoryTable
          title={'System trade history'}
          captions={[
            'Name Bot',
            'Client Id',
            'Order Id',
            'Type',
            'Position Side',
            'Size',
            'Symbol',
            'Resolution',
            'Open Price',
            'Close Price',
            'Open Time',
            'Close Time',
            'Stop Lost',
            'Take Profit',
            'Profit',
            'Swap',
            'Commission',
            'Comment',
          ]}
          data={trades || []}
          filter={filter}
          handleChangePage={handleChangePage}
          handleChangeSize={handleChangeSize}
          totalPage={totalPage}
          total={total}
          changeSort={handleChangeSort}
        />
      </div>
    </div>
  );
};

export default TBotSystemTradeHistoryListing;
