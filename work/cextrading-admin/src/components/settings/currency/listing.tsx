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
  GridItem,
} from '@chakra-ui/react';
// Custom components

import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';

import React, { useEffect, useMemo, useState } from 'react';
import {
  deleteCurrency,
  listCurrency,
  normalizeCurrency,
  updateOrderCurrency,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { ERROR_CODE } from 'fetcher/interface';
import TableRow from './table-row';
import { MyTh } from 'components/tables';
import { Currency, UpdateOrderCurrency } from './interface';
import { HiCheckCircle, HiPlus } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { MESSAGE } from 'constants/message';
import useMyAbility from 'hook/ability';
import SelectMultipleField from 'components/form/select-multiple-field';
import {
  CreateAppSetting,
  createAppSetting,
  getAppSettings,
  normalizeAppSetting,
  updateAppSetting,
} from '../cextrading/fetcher';
import { AppSeting, SETTING_NAME } from '../cextrading/interface';
interface Props {
  title: string;
  captions: string[];
  data: Currency[];
  handleEdit: (id: Currency['id']) => void;
  handleDelete: (id: Currency['id']) => void;
  changeOrder: (index: number, orderChange: 1 | -1) => void;
}

const captions = ['Icon', 'Name', 'Description', 'Code', 'Create Date', ''];

const CurrencyTable = ({
  title,
  captions,
  data,
  handleDelete,
  handleEdit,
  changeOrder,
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
              data.map((row, index) => {
                return (
                  <TableRow
                    index={index}
                    key={row.id}
                    row={row}
                    handleDelete={() => handleDelete(row.id)}
                    handleEdit={() => handleEdit(row.id)}
                    changeOrder={changeOrder}
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

const CurrencyListing = (): JSX.Element => {
  const router = useRouter();
  const toast = useToastHook();
  const ability = useMyAbility();

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currencySelected, setCurrencySelected] = useState<
    Currency['id'] | null
  >(null);
  const [isOrderChange, setIsOrderChange] = useState<boolean>(true);

  const [pkgIdSelected, setPkgIdSelected] = useState<string[]>([]);
  const [sBotIdSelected, setSBotIdSelected] = useState<string[]>([]);
  const [tBotIdSelected, setTBotIdSelected] = useState<string[]>([]);
  const [appSettings, setAppSettings] = useState<AppSeting[] | null>(null);

  const fetchAppSettings = () => {
    getAppSettings().then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        const appSettings = normalizeAppSetting(res.payload);
        setAppSettings(appSettings);
        if (appSettings) {
          const dataSBot = appSettings.find(
            (a) => a.name === SETTING_NAME.CURRENCY_SBOT,
          );
          if (!dataSBot) {
            const data: CreateAppSetting = {
              name: SETTING_NAME.CURRENCY_SBOT,
              value: '',
              description: '',
            };
            createAppSetting(data).catch((err) => {
              toast({
                description: JSON.parse(err.message).message,
                status: STATUS.ERROR,
              });
            });
            fetchAppSettings();
          } else {
            setSBotIdSelected(
              dataSBot.value.split(',').map(function (item) {
                return item.trim();
              }),
            );
          }

          const dataTBot = appSettings.find(
            (a) => a.name === SETTING_NAME.CURRENCY_TBOT,
          );
          if (!dataTBot) {
            const data: CreateAppSetting = {
              name: SETTING_NAME.CURRENCY_TBOT,
              value: '',
              description: '',
            };
            createAppSetting(data).catch((err) => {
              toast({
                description: JSON.parse(err.message).message,
                status: STATUS.ERROR,
              });
            });
            fetchAppSettings();
          } else {
            setTBotIdSelected(
              dataTBot?.value.split(',').map(function (item) {
                return item.trim();
              }),
            );
          }

          const dataPkg = appSettings.find(
            (a) => a.name === SETTING_NAME.CURRENCY_PKG,
          );
          if (!dataPkg) {
            const data: CreateAppSetting = {
              name: SETTING_NAME.CURRENCY_PKG,
              value: '',
              description: '',
            };
            createAppSetting(data).catch((err) => {
              toast({
                description: JSON.parse(err.message).message,
                status: STATUS.ERROR,
              });
            });
            fetchAppSettings();
          } else {
            setPkgIdSelected(
              dataPkg.value.split(',').map(function (item) {
                return item.trim();
              }),
            );
          }
        }
      }
    });
  };

  const fetchData = () => {
    listCurrency()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const resCurrencies = normalizeCurrency(res.payload);
          setCurrencies(resCurrencies);
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
    fetchAppSettings();
    fetchData();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const handleCreate = () => {
    router.push('/settings/currency/create');
  };
  const handleEdit = (id: Currency['id']) => {
    router.push(`/settings/currency/${id}`);
  };

  const handleDelete = (id: Currency['id']) => {
    onOpen();
    setCurrencySelected(id);
  };

  const handledeleteCurrency = () => {
    if (!currencySelected) return;
    setLoading(true);
    deleteCurrency(currencySelected)
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
  function changeOrder(index: number, orderChange: 1 | -1) {
    if (currencies) {
      const tempCurrencies = [...currencies];
      const tempOrder = tempCurrencies[index].order;
      if (orderChange === 1) {
        if (index === 0) {
          tempCurrencies[index].order =
            tempCurrencies[currencies.length - 1].order;
          tempCurrencies[currencies.length - 1].order = tempOrder;
        } else {
          tempCurrencies[index].order = tempCurrencies[index - 1].order;
          tempCurrencies[index - 1].order = tempOrder;
        }
      } else {
        if (index === currencies.length - 1) {
          tempCurrencies[index].order = tempCurrencies[0].order;
          tempCurrencies[0].order = tempOrder;
        } else {
          tempCurrencies[index].order = tempCurrencies[index + 1].order;
          tempCurrencies[index + 1].order = tempOrder;
        }
      }
      tempCurrencies.sort((a, b) => a.order - b.order);
      setCurrencies(tempCurrencies);
      setIsOrderChange(false);
    }
  }
  const handleEditCurrency = () => {
    if (!currencies) {
      return;
    }
    // edit role // edit feature role
    const newCurrencies: UpdateOrderCurrency[] = currencies.map((e) => {
      return {
        id: e.id,
        order: e.order,
      };
    });
    return updateOrderCurrency({ currencies: newCurrencies })
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

  const currenciesOptions = useMemo(
    () =>
      currencies.map((currencies) => {
        return {
          value: currencies.id,
          label: currencies.name + ' - ' + currencies.currency,
        };
      }),
    [currencies],
  );

  const sBotIdsSelected = useMemo(
    () =>
      currencies
        .filter((res) => sBotIdSelected?.includes(res.id))
        .map((curr) => {
          return {
            value: curr.id,
            label: curr.name + ' - ' + curr.currency,
          };
        }),
    [currencies, sBotIdSelected],
  );

  const tBotIdsSelected = useMemo(
    () =>
      currencies
        .filter((res) => tBotIdSelected?.includes(res.id))
        .map((curr) => {
          return {
            value: curr.id,
            label: curr.name + ' - ' + curr.currency,
          };
        }),
    [currencies, tBotIdSelected],
  );

  const pkgIdsSelected = useMemo(
    () =>
      currencies
        .filter((res) => pkgIdSelected?.includes(res.id))
        .map((curr) => {
          return {
            value: curr.id,
            label: curr.name + ' - ' + curr.currency,
          };
        }),
    [currencies, pkgIdSelected],
  );

  function saveCurrencies() {
    fetchAppSettings();
    const dataSBot = {
      name: `${SETTING_NAME.CURRENCY_SBOT}`,
      value: `${sBotIdSelected?.join(',')}`,
      description: '',
    };
    const dataTBot = {
      name: `${SETTING_NAME.CURRENCY_TBOT}`,
      value: `${tBotIdSelected?.join(',')}`,
      description: '',
    };
    const dataPkg = {
      name: `${SETTING_NAME.CURRENCY_PKG}`,
      value: `${pkgIdSelected?.join(',')}`,
      description: '',
    };

    const idPkg = appSettings?.find(
      (a) => a.name === SETTING_NAME.CURRENCY_PKG,
    )?.id;

    const idSBot = appSettings?.find(
      (a) => a.name === SETTING_NAME.CURRENCY_SBOT,
    )?.id;

    const idTBot = appSettings?.find(
      (a) => a.name === SETTING_NAME.CURRENCY_TBOT,
    )?.id;

    updateAppSetting(dataPkg, idPkg)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          updateAppSetting(dataSBot, idSBot)
            .then(() => {
              updateAppSetting(dataTBot, idTBot)
                .then(() => {
                  toast({
                    description: MESSAGE.SUCCESS,
                    status: STATUS.SUCCESS,
                  });
                  fetchAppSettings();
                })
                .catch((err) => {
                  toast({
                    description: JSON.parse(err.message).message,
                    status: STATUS.ERROR,
                  });
                });
            })
            .catch((err) => {
              toast({
                description: JSON.parse(err.message).message,
                status: STATUS.ERROR,
              });
            });
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  }

  const bg = useColorModeValue('white', 'gray.700');

  return (
    <>
      <Flex align="center" justify="end" mb="20px">
        {ability.can('ROLE', ability.permissions.CREATE_CURRENCY) && (
          <Button
            bg="teal.300"
            mr={5}
            disabled={isOrderChange}
            rightIcon={<HiCheckCircle />}
            onClick={handleEditCurrency}
          >
            Save Change
          </Button>
        )}
        {ability.can('ROLE', ability.permissions.CREATE_CURRENCY) && (
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={handleCreate}>
            Create
          </Button>
        )}
      </Flex>
      <div style={{ marginBottom: 24 }}>
        <CurrencyTable
          title={'Currency List'}
          captions={captions}
          data={currencies || []}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          changeOrder={changeOrder}
        />
      </div>
      <Card bg={bg} borderRadius={15}>
        <Flex direction="column" paddingBottom={'8px'}>
          <Text fontSize="xl" fontWeight="bold">
            Choose Currencies
          </Text>
        </Flex>
        <GridItem colSpan={18} padding={'0 24px'}>
          <Flex>
            <SelectMultipleField
              id="pkg"
              label="Package"
              placeholder="ENTER PKG CURRENCY"
              disabled={false}
              options={currenciesOptions}
              value={pkgIdsSelected}
              setValue={(currenciesSelected) => {
                const currenciesIdsSelected = currenciesSelected.map((r) => {
                  return r.value;
                });
                setPkgIdSelected(currenciesIdsSelected);
              }}
            />
          </Flex>
        </GridItem>
        <GridItem colSpan={18} padding={'0 24px'}>
          <Flex>
            <SelectMultipleField
              id="tBot"
              label="Tbot"
              placeholder="ENTER TBOT CURRENCY"
              disabled={false}
              options={currenciesOptions}
              value={tBotIdsSelected}
              setValue={(currenciesSelected) => {
                const currenciesIdsSelected = currenciesSelected.map((r) => {
                  return r.value;
                });
                setTBotIdSelected(currenciesIdsSelected);
              }}
            />
          </Flex>
        </GridItem>
        <GridItem colSpan={18} padding={'0 24px'}>
          <Flex>
            <SelectMultipleField
              id="sBot"
              label="Sbot"
              placeholder="ENTER SBOT CURRENCY"
              disabled={false}
              options={currenciesOptions}
              value={sBotIdsSelected}
              setValue={(currenciesSelected) => {
                const currenciesIdsSelected = currenciesSelected.map((r) => {
                  return r.value;
                });
                setSBotIdSelected(currenciesIdsSelected);
              }}
            />
          </Flex>
        </GridItem>
        <Button
          bg="teal.300"
          width={150}
          onClick={() => saveCurrencies()}
          style={{ margin: '4px 0 8px 24px' }}
        >
          Save Change
        </Button>
      </Card>
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
                onClick={handledeleteCurrency}
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

export default CurrencyListing;
