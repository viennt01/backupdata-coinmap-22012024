import { useForm } from 'react-hook-form';
import { Button, Heading, Box, useColorModeValue } from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { CreateExchange, Exchange } from './interface';
import InputField from 'components/form/input-field';
import TextareaField from 'components/form/textarea-field';
import {
  createExchange,
  editExchange,
  getExchange,
  normalizeExchange,
  RawExchangeCreate,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BackButton from 'components/back-btn';
import React from 'react';

interface Props {
  editing?: boolean;
}

export default function CreateExchangePage({ editing }: Props) {
  const resolver = useYupValidationResolver<CreateExchange>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateExchange>({
    resolver,
    defaultValues: {
      exchangeName: '',
      exchangeDesc: '',
    },
  });
  const toast = useToastHook();
  const router = useRouter();
  const [exchange, setExchange] = useState<Exchange | null>(null);

  useEffect(() => {
    if (editing) {
      const exchangeName = router.query.id;
      if (exchangeName) {
        getExchange(exchangeName as Exchange['exchangeName']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const exchanges = normalizeExchange([res.payload]);
            setExchange(exchanges[0]);
            setValue('exchangeName', exchanges[0].exchangeName);
            setValue('exchangeDesc', exchanges[0].exchangeDesc);
          }
        });
      }
    }
  }, [router, editing, setValue]);

  const handleUpdateFeature = (values: CreateExchange) => {
    if (!exchange) return;
    const data: RawExchangeCreate = {
      exchange_name: values.exchangeName,
      exchange_desc: values.exchangeDesc,
    };

    return editExchange(data)
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

  const handleCreateFeature = (values: CreateExchange) => {
    const data: RawExchangeCreate[] = [
      {
        exchange_name: values.exchangeName,
        exchange_desc: values.exchangeDesc,
      },
    ];
    return createExchange(data)
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

  async function onSubmit(values: CreateExchange) {
    if (editing) {
      await handleUpdateFeature(values);
    } else {
      await handleCreateFeature(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Exchange listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit exchange' : 'Create a new exchange'}
        </Heading>
        <InputField
          id="exchangeName"
          label="Exchange name"
          placeholder="Enter exchange name"
          required
          disabled={editing}
          {...register('exchangeName')}
          error={errors.exchangeName?.message}
        />
        <TextareaField
          id="exchangeDesc"
          label="Description"
          placeholder="Enter description"
          required
          {...register('exchangeDesc')}
          error={errors.exchangeDesc?.message}
        />
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
