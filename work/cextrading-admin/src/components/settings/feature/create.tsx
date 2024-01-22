import { useForm } from 'react-hook-form';
import { Button, Heading, Box, useColorModeValue } from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { Feature } from './interface';
import { FEATURE_ACTIONS } from 'constants/index';
import InputField from 'components/form/input-field';
import TextareaField from 'components/form/textarea-field';
import SelectField from 'components/form/select-field';
import {
  createFeature,
  editFeature,
  getFeature,
  normalizeFeature,
  RawFeatureCreate,
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
  const resolver = useYupValidationResolver<Feature>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Feature>({
    resolver,
    defaultValues: {
      featureName: '',
      description: '',
      action: '',
    },
  });
  const toast = useToastHook();
  const router = useRouter();
  const [feature, setFeature] = useState<Feature | null>(null);

  useEffect(() => {
    if (editing) {
      const featureId = router.query.id;
      if (featureId) {
        getFeature(featureId as Feature['featureId']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const features = normalizeFeature([res.payload]);
            setFeature(features[0]);
            setValue('featureName', features[0].featureName);
            setValue('description', features[0].description);
            setValue('action', features[0].action);
          }
        });
      }
    }
  }, [router, editing, setValue]);

  const handleUpdateFeature = (values: Feature) => {
    if (!feature) return;
    const data: RawFeatureCreate = {
      feature_id: feature.featureId,
      feature_name: values.featureName,
      description: values.description,
      action: values.action as FEATURE_ACTIONS,
    };

    return editFeature(data)
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

  const handleCreateFeature = (values: Feature) => {
    const data: RawFeatureCreate[] = [
      {
        feature_id: values.featureName.toUpperCase().split(' ').join('_'),
        feature_name: values.featureName,
        description: values.description,
        action: values.action as FEATURE_ACTIONS,
      },
    ];
    return createFeature(data)
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

  async function onSubmit(values: Feature) {
    if (editing) {
      await handleUpdateFeature(values);
    } else {
      await handleCreateFeature(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Feature listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit feature' : 'Create a new feature'}
        </Heading>
        <InputField
          id="featureName"
          label="Feature name"
          placeholder="Enter feature name"
          required
          {...register('featureName')}
          error={errors.featureName?.message}
        />
        <TextareaField
          id="description"
          label="Description"
          placeholder="Enter description"
          required
          {...register('description')}
          error={errors.description?.message}
        />
        <SelectField
          id="action"
          label="Action"
          placeholder="Enter action"
          required
          {...register('action')}
          error={errors.action?.message}
        >
          {Object.keys(FEATURE_ACTIONS).map((key) => {
            return (
              <option
                key={key}
                value={FEATURE_ACTIONS[key as keyof typeof FEATURE_ACTIONS]}
              >
                {FEATURE_ACTIONS[key as keyof typeof FEATURE_ACTIONS]}
              </option>
            );
          })}
        </SelectField>
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
