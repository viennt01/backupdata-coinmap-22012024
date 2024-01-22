import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Box,
  useColorModeValue,
  Image,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { CreateCurrency, Currency } from './interface';
import InputField from 'components/form/input-field';
import {
  createCurrency,
  editCurrency,
  getCurrency,
  normalizeCurrency,
  RawCurrencyCreate,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BackButton from 'components/back-btn';
import React from 'react';
import FileUploader from './uploader';

interface Props {
  editing?: boolean;
}

export default function CreateCurrencyPage({ editing }: Props) {
  const resolver = useYupValidationResolver<CreateCurrency>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCurrency>({
    resolver,
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      currency: '',
    },
  });
  const toast = useToastHook();
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency | null>(null);

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (editing) {
      const id = router.query.id;
      if (id) {
        getCurrency(id as Currency['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const currency = normalizeCurrency([res.payload]);
            setCurrency(currency[0]);
            setValue('name', currency[0].name);
            setValue('description', currency[0].description);
            setValue('imageUrl', currency[0].imageUrl);
            setValue('currency', currency[0].currency);
          }
        });
      }
    }
  }, [router, editing, setValue]);

  const handleUpdateCurrency = (values: CreateCurrency) => {
    const id = router.query.id;
    if (!currency || typeof id !== 'string') return;
    const data: RawCurrencyCreate = {
      name: values.name,
      description: values.description,
      image_url: values.imageUrl,
      currency: values.currency,
    };

    return editCurrency(id, data)
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

  const handleCreateCurrency = (values: CreateCurrency) => {
    const data: RawCurrencyCreate = {
      name: values.name,
      description: values.description,
      image_url: values.imageUrl,
      currency: values.currency,
    };

    return createCurrency(data)
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

  async function onSubmit(values: CreateCurrency) {
    if (editing) {
      await handleUpdateCurrency(values);
    } else {
      await handleCreateCurrency(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Currency listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit currency' : 'Create a new currency'}
        </Heading>
        <InputField
          id="name"
          label="Name"
          placeholder="Enter name"
          required
          {...register('name')}
          error={errors.name?.message}
        />
        <InputField
          id="description"
          label="Description"
          placeholder="Enter description"
          required
          {...register('description')}
          error={errors.description?.message}
        />
        <InputField
          id="currency"
          label="Currency"
          placeholder="Enter currency"
          required
          {...register('currency')}
          error={errors.currency?.message}
        />
        <Text fontSize="md" fontWeight="bold" me="10px" mb="5px">
          ICon
        </Text>
        <Flex>
          <Image
            borderRadius="full"
            boxSize="50px"
            src={imageUrl}
            alt=""
            mr="10px"
          />
          <FileUploader
            setUrl={(url) => setValue('imageUrl', url)}
            url={imageUrl}
          />
        </Flex>

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
