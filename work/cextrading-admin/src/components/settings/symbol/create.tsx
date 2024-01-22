import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Box,
  useColorModeValue,
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { CreateSymbol, SYMBOL_STATUS } from './interface';
import InputField from 'components/form/input-field';
import TextareaField from 'components/form/textarea-field';
import CheckboxField from 'components/form/checkbox-field';
import {
  createSymbol,
  editSymbol,
  getSymbol,
  normalizeSymbol,
  RawSymbol,
  RawSymbolCreate,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import BackButton from 'components/back-btn';
import React, { useEffect, useState } from 'react';
import { getExchanges, normalizeExchange } from '../exchange/fetcher';
import SelectField from 'components/form/select-field';
import { useRouter } from 'next/router';

interface Props {
  editing?: boolean;
}

export default function CreateSymbolPage({ editing }: Props) {
  const resolver = useYupValidationResolver<CreateSymbol>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateSymbol>({
    resolver,
    defaultValues: {
      symbol: '',
      types: '',
      exchangeName: '',
      baseSymbol: '',
      quoteSymbol: '',
      description: '',
      ticks: {
        tickvalue: 0,
        tickvalueHeatmap: 0,
      },
      status: SYMBOL_STATUS.OFF,
      timezone: 'UTC',
      minmov: 0,
      minmov2: 0,
      pointvalue: 0,
      session: '24x7',
      hasIntraday: false,
      hasNoVolume: false,
      pricescale: 0,
    },
  });
  const toast = useToastHook();
  const router = useRouter();
  const [exchangeOptions, setExchangeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const isSymbolOn = watch('status') === SYMBOL_STATUS.ON ? true : false;
  const hasIntraday = watch('hasIntraday') || false;
  const hasNoVolume = watch('hasNoVolume') || false;
  const fetchExchanges = () => {
    getExchanges()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const exchanges = normalizeExchange(res.payload);
          setExchangeOptions(
            exchanges.map((ex) => ({
              value: ex.exchangeName,
              label: ex.exchangeName,
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

  const fetchSymbol = (symbolName: RawSymbol['symbol']) => {
    getSymbol(symbolName)
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const symbol = normalizeSymbol([res.payload]);
          setValue('symbol', symbol[0].symbol);
          setValue('types', symbol[0].types);
          setValue('exchangeName', symbol[0].exchangeName);
          setValue('baseSymbol', symbol[0].baseSymbol);
          setValue('quoteSymbol', symbol[0].quoteSymbol);
          setValue('description', symbol[0].description);
          setValue('ticks', symbol[0].ticks);
          setValue('status', symbol[0].status);
          setValue('timezone', symbol[0].timezone);
          setValue('minmov', symbol[0].minmov);
          setValue('minmov2', symbol[0].minmov2);
          setValue('pointvalue', symbol[0].pointvalue);
          setValue('session', symbol[0].session);
          setValue('hasIntraday', symbol[0].hasIntraday);
          setValue('hasNoVolume', symbol[0].hasNoVolume);
          setValue('pricescale', symbol[0].pricescale);
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
    fetchExchanges();
  }, []);
  useEffect(() => {
    const symbolName = router.query.id;
    if (symbolName) {
      fetchSymbol(symbolName as RawSymbol['symbol']);
    }
  }, [exchangeOptions]);
  const handleUpdateSymbol = (values: CreateSymbol) => {
    const data: Omit<RawSymbolCreate, 'symbol'> = {
      types: values.types,
      exchange_name: values.exchangeName,
      base_symbol: values.baseSymbol,
      quote_symbol: values.quoteSymbol,
      description: values.description,
      ticks: values.ticks,
      status: values.status,
      timezone: values.timezone,
      minmov: Number(values.minmov) || 0,
      minmov2: Number(values.minmov2) || 0,
      pointvalue: Number(values.pointvalue) || 0,
      session: values.session,
      has_intraday: values.hasIntraday || false,
      has_no_volume: values.hasNoVolume || false,
      pricescale: Number(values.pricescale) || 0,
    };

    return editSymbol(data, values.symbol)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const handleCreateSymbol = (values: CreateSymbol) => {
    const data: RawSymbolCreate[] = [
      {
        symbol: values.symbol,
        types: values.types,
        exchange_name: values.exchangeName,
        base_symbol: values.baseSymbol,
        quote_symbol: values.quoteSymbol,
        description: values.description,
        ticks: values.ticks,
        status: values.status,
        timezone: values.timezone,
        minmov: Number(values.minmov) || 0,
        minmov2: Number(values.minmov2) || 0,
        pointvalue: Number(values.pointvalue) || 0,
        session: values.session,
        has_intraday: values.hasIntraday || false,
        has_no_volume: values.hasNoVolume || false,
        pricescale: Number(values.pricescale) || 0,
      },
    ];
    return createSymbol(data)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          reset();
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  async function onSubmit(values: CreateSymbol) {
    if (editing) {
      await handleUpdateSymbol(values);
    } else {
      await handleCreateSymbol(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Symbol listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit symbol' : 'Create a new symbol'}
        </Heading>
        <Box mb="20px">
          <Heading size="md">Information</Heading>
          <Divider mb={'20px'} />
          <Grid px={'20px'} templateColumns="repeat(12, 1fr)" columnGap={30}>
            <GridItem colSpan={6}>
              <InputField
                id="symbol"
                label="Symbol name"
                placeholder="Enter symbol name"
                required
                disabled={editing}
                {...register('symbol')}
                error={errors.symbol?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="types"
                label="Types name"
                placeholder="Enter types name"
                required
                {...register('types')}
                error={errors.types?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <SelectField
                id="exchangeName"
                label="Exchange Name"
                required
                {...register('exchangeName')}
                error={errors.exchangeName?.message}
              >
                <option value="" disabled>
                  Choose exchange name
                </option>
                {exchangeOptions.map((ex) => {
                  return (
                    <option key={ex.value} value={ex.value}>
                      {ex.label}
                    </option>
                  );
                })}
              </SelectField>
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="baseSymbol"
                label="Base symbol name"
                placeholder="Enter base symbol name"
                required
                {...register('baseSymbol')}
                error={errors.baseSymbol?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="quoteSymbol"
                label="QuoteSymbol name"
                placeholder="Enter quote symbol name"
                required
                {...register('quoteSymbol')}
                error={errors.quoteSymbol?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="timezone"
                label="Timezone"
                placeholder="Enter timezone"
                {...register('timezone')}
                error={errors.timezone?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="minmov"
                label="Minmov"
                placeholder="Enter minmov"
                type="number"
                {...register('minmov')}
                error={errors.minmov?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="minmov2"
                label="Minmov 2"
                placeholder="Enter minmov 2"
                type="number"
                {...register('minmov2')}
                error={errors.minmov2?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="pointvalue"
                label="Pointvalue"
                placeholder="Enter pointvalue"
                type="number"
                {...register('pointvalue')}
                error={errors.pointvalue?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="pricescale"
                label="pricescale"
                placeholder="Enter pricescale"
                type="number"
                {...register('pricescale')}
                error={errors.pricescale?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <InputField
                id="session"
                label="Session"
                placeholder="Enter session"
                {...register('session')}
                error={errors.session?.message}
              />
            </GridItem>
            <GridItem colSpan={6}>
              <TextareaField
                id="description"
                label="Description"
                placeholder="Enter description"
                required
                {...register('description')}
                error={errors.description?.message}
              />
            </GridItem>
            <CheckboxField
              isChecked={hasIntraday}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('hasIntraday', true);
                } else {
                  setValue('hasIntraday', false);
                }
              }}
            >
              hasIntraday?
            </CheckboxField>
            <CheckboxField
              isChecked={hasNoVolume}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('hasNoVolume', true);
                } else {
                  setValue('hasNoVolume', false);
                }
              }}
            >
              hasNoVolume?
            </CheckboxField>
          </Grid>
        </Box>
        <Box>
          <Heading size="md">Ticks</Heading>
          <Divider mb={'20px'} />
          <Grid px={'20px'} templateColumns="repeat(12, 1fr)" columnGap={30}>
            <GridItem colSpan={3}>
              <InputField
                id="ticks.tickvalue"
                label="Tickvalue"
                placeholder="Enter tickvalue"
                required
                {...register('ticks.tickvalue')}
                error={errors['ticks.tickvalue']?.message}
              />
            </GridItem>
            <GridItem colSpan={3}>
              <InputField
                id="ticks.tickvalueHeatmap"
                label="Tickvalue Heatmap"
                placeholder="Enter Tickvalue Heatmap"
                required
                {...register('ticks.tickvalueHeatmap')}
                error={errors['ticks.tickvalueHeatmap']?.message}
              />
            </GridItem>
          </Grid>
          <CheckboxField
            isChecked={isSymbolOn}
            onChange={(e) => {
              if (e.target.checked) {
                setValue('status', SYMBOL_STATUS.ON);
              } else {
                setValue('status', SYMBOL_STATUS.OFF);
              }
            }}
          >
            On chart?
          </CheckboxField>
        </Box>
        <Button
          mt={4}
          colorScheme="teal"
          bg="teal.300"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </Box>
    </form>
  );
}
