import { useForm } from 'react-hook-form';
import { Button, Heading, Box, useColorModeValue } from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { CreateResolution, Resolution } from './interface';
import InputField from 'components/form/input-field';
import {
  createResolution,
  editResolution,
  getResolution,
  normalizeResolution,
  RawResolutionCreate,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import BackButton from 'components/back-btn';
import React, { useEffect, useState } from 'react';
import router from 'next/router';

interface Props {
  editing?: boolean;
}

export default function CreateResolutionPage({ editing }: Props) {
  const resolver = useYupValidationResolver<CreateResolution>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateResolution>({
    resolver,
    defaultValues: {
      resolutionsName: '',
      displayName: '',
    },
  });
  const toast = useToastHook();
  const [resolution, setResolution] = useState<Resolution | null>(null);

  useEffect(() => {
    if (editing) {
      const id = router.query.id;
      if (id) {
        getResolution(id as Resolution['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const resolutions = normalizeResolution([res.payload]);
            setResolution(resolutions[0]);
            setValue('resolutionsName', resolutions[0].resolutionsName);
            setValue('displayName', resolutions[0].displayName);
          }
        });
      }
    }
  }, [router, editing, setValue]);

  const handleUpdateResolution = (values: CreateResolution) => {
    if (!resolution) return;
    const data: RawResolutionCreate = {
      display_name: values.displayName,
      resolutions_name: values.resolutionsName,
    };

    return editResolution(data, resolution.id)
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

  const handleCreateResolution = (values: CreateResolution) => {
    const data: RawResolutionCreate[] = [
      {
        resolutions_name: values.resolutionsName,
        display_name: values.displayName,
      },
    ];
    return createResolution(data)
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

  async function onSubmit(values: CreateResolution) {
    if (editing) {
      await handleUpdateResolution(values);
    } else {
      await handleCreateResolution(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Resolution listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit resolution' : 'Create a new resolution'}
        </Heading>
        <InputField
          id="resolutionName"
          label="Resolution name"
          placeholder="Enter resolution name"
          required
          disabled={editing}
          {...register('resolutionsName')}
          error={errors.resolutionsName?.message}
        />
        <InputField
          id="displayName"
          label="Resolution display name"
          placeholder="Enter resolution display name"
          required
          {...register('displayName')}
          error={errors.displayName?.message}
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
