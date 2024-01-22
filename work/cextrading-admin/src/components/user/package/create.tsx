import { useForm } from 'react-hook-form';
import { Button, Heading, Box, useColorModeValue } from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { CreatePackageTime, PackageTime, PACKAGE_TIME_TYPE } from './interface';
import InputField from 'components/form/input-field';
import {
  createPackageTime,
  updatePackageTime,
  getPackageTime,
  normalizePackageTime,
  RawPackageTimeCreate,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import BackButton from 'components/back-btn';
import React from 'react';
import CheckboxField from 'components/form/checkbox-field';
import SelectField from 'components/form/select-field';

interface Props {
  editing?: boolean;
}

const typeOptions = Object.values(PACKAGE_TIME_TYPE);
export default function CreatePackageTimePage({ editing }: Props) {
  const resolver =
    useYupValidationResolver<CreatePackageTime>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePackageTime>({
    resolver,
    defaultValues: {
      name: '',
      discountRate: 0,
      discountAmount: 0,
      status: true,
      type: '',
    },
  });
  const toast = useToastHook();
  const router = useRouter();
  useEffect(() => {
    if (editing) {
      const id = router.query.id;
      if (id) {
        getPackageTime(id as PackageTime['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const packageTime = normalizePackageTime(res.payload);
            setValue('name', packageTime.name);
            setValue('quantity', packageTime.quantity);
            setValue('discountAmount', packageTime.discountAmount);
            setValue('discountRate', packageTime.discountRate);
            setValue('status', packageTime.status);
            setValue('type', packageTime.type);
          }
        });
      }
    }
  }, [router, editing, setValue]);
  const packageStatus = watch('status');
  const handleUpdatePackage = (values: CreatePackageTime) => {
    const id = router.query.id;
    if (typeof id !== 'string') return;
    const data: RawPackageTimeCreate = {
      name: values.name,
      discount_rate: Number(values.discountRate) || 0,
      discount_amount: Number(values.discountAmount) || 0,
      status: values.status,
      quantity: Number(values.quantity) || 0,
      type: values.type,
    };

    return updatePackageTime(id, data)
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

  const handleCreatePackage = (values: CreatePackageTime) => {
    const data: RawPackageTimeCreate = {
      name: values.name,
      discount_rate: Number(values.discountRate) || 0,
      discount_amount: Number(values.discountAmount) || 0,
      status: values.status,
      quantity: Number(values.quantity) || 0,
      type: values.type,
    };
    return createPackageTime(data)
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

  async function onSubmit(values: CreatePackageTime) {
    if (editing) {
      await handleUpdatePackage(values);
    } else {
      await handleCreatePackage(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Package listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit package' : 'Create a package'}
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
          id="quantity"
          label="Quantity"
          placeholder="Enter quantity"
          required
          {...register('quantity')}
          error={errors.quantity?.message}
        />
        <InputField
          id="discountRate"
          label="Discount Rate"
          placeholder="Enter discount rate"
          required
          {...register('discountRate')}
          error={errors.discountRate?.message}
        />
        <InputField
          id="discountAmount"
          label="Discount Amount"
          placeholder="Enter discount amount"
          required
          {...register('discountAmount')}
          error={errors.discountAmount?.message}
        />
        <SelectField
          id="type"
          label="Type"
          required
          {...register('type')}
          error={errors.type?.message}
        >
          {typeOptions.map((type) => {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </SelectField>
        <CheckboxField
          isChecked={packageStatus}
          onChange={(e) => {
            if (e.target.checked) {
              setValue('status', true);
            } else {
              setValue('status', false);
            }
          }}
        >
          Active?
        </CheckboxField>
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
