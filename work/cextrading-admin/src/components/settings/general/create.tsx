import { useForm } from 'react-hook-form';
import { Button, Heading, Box, useColorModeValue } from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { General } from './interface';
import InputField from 'components/form/input-field';
import TextareaField from 'components/form/textarea-field';
import {
  createGeneral,
  editGeneral,
  getGeneral,
  normalizeGeneral,
  RawGeneralCreate,
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

export default function CreateFeature({ editing }: Props) {
  const resolver = useYupValidationResolver<General>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<General>({
    resolver,
    defaultValues: {
      generalSettingId: '',
      generalSettingName: '',
      description: '',
    },
  });
  const toast = useToastHook();
  const router = useRouter();
  const [general, setGeneral] = useState<General | null>(null);

  useEffect(() => {
    if (editing) {
      const generalId = router.query.id;
      if (generalId) {
        getGeneral(generalId as General['generalSettingId']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const generals = normalizeGeneral([res.payload]);
            setGeneral(generals[0]);
            setValue('generalSettingId', generals[0].generalSettingId);
            setValue('generalSettingName', generals[0].generalSettingName);
            setValue('description', generals[0].description);
          }
        });
      }
    }
  }, [router, editing, setValue]);

  const handleUpdateGeneral = (values: General) => {
    if (!general) return;
    const data: RawGeneralCreate = {
      general_setting_id: values.generalSettingId,
      general_setting_name: values.generalSettingName,
      description: values.description,
    };

    return editGeneral(data)
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

  const handleCreateGeneral = (values: General) => {
    const data: RawGeneralCreate[] = [
      {
        general_setting_id: values.generalSettingId
          .toUpperCase()
          .split(' ')
          .join('_'),
        general_setting_name: values.generalSettingName,
        description: values.description,
      },
    ];
    return createGeneral(data)
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

  async function onSubmit(values: General) {
    if (editing) {
      await handleUpdateGeneral(values);
    } else {
      await handleCreateGeneral(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="General listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit general' : 'Create a new general'}
        </Heading>
        <InputField
          id="generalSettingId"
          label="General Id"
          placeholder="Enter general id"
          required
          {...register('generalSettingId')}
          error={errors.generalSettingId?.message}
        />
        <InputField
          id="generalSettingName"
          label="General name"
          placeholder="Enter general name"
          required
          {...register('generalSettingName')}
          error={errors.generalSettingName?.message}
        />
        <TextareaField
          id="description"
          label="Description"
          placeholder="Enter description"
          required
          {...register('description')}
          error={errors.description?.message}
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
