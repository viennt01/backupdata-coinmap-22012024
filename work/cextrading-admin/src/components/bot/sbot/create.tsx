import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Box,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
  Input,
  FormLabel,
  Text,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Flex,
  Image,
} from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { Bot, BotStatus, CreateBot } from './interface';
import InputField from 'components/form/input-field';
import {
  getBotDetail,
  getListSettingBots,
  createBot,
  RawBotCreate,
  normalizeBot,
  updateBot,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import BackButton from 'components/back-btn';
import React from 'react';
import SelectField from 'components/form/select-field';
import FileUploader from './uploader';

interface Props {
  editing?: boolean;
}

export default function CreateSBot({ editing }: Props) {
  const resolver = useYupValidationResolver<CreateBot>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateBot>({
    resolver,
    defaultValues: {
      name: '',
      botSettingId: '',
      type: '',
      status: '',
      price: '',
      currency: '',
      description: '',
      order: 0,
      workBasedOn: [],
      imageUrl: '',
    },
  });

  const toast = useToastHook();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [listBotOptions, setListBotOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const values = getValues();
  const workBasedOn = watch('workBasedOn');
  const imageUrl = watch('imageUrl');
  const botSettingId = watch('botSettingId');

  useEffect(() => {
    getListSettingBots().then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        const listBotOptions = res.payload.map((bot) => {
          return {
            value: bot.id,
            label: bot.name,
          };
        });
        setListBotOptions(listBotOptions);
      }
    });
  }, []);

  const handleKeydownWorkBasedOn = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (inputRef.current !== null) {
        const workBasedOn = values.workBasedOn;
        workBasedOn.push(event.currentTarget.value);
        setValue('workBasedOn', workBasedOn);
        inputRef.current.value = '';
      }
      return false;
    }
  };

  const handleAddWorkBasedOn = () => {
    if (inputRef.current !== null) {
      const workBasedOn = values.workBasedOn;
      workBasedOn.push(inputRef.current.value);
      setValue('workBasedOn', workBasedOn);
      inputRef.current.value = '';
    }
  };

  const handleDeleteWorkBasedOn = (index: number) => {
    let workBasedOn = values.workBasedOn;
    workBasedOn = workBasedOn.filter((_, i) => i !== index);
    setValue('workBasedOn', workBasedOn);
  };

  useEffect(() => {
    if (editing) {
      const id = router.query.id;
      if (id) {
        getBotDetail(id as Bot['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const bot = normalizeBot(res.payload);
            setValue('name', bot.name);
            setValue('botSettingId', bot.botSettingId);
            setValue('type', bot.type);
            setValue('status', bot.status);
            setValue('price', bot.price);
            setValue('currency', 'USD');
            setValue('description', bot.description);
            setValue('order', bot.order);
            setValue('workBasedOn', bot.workBasedOn);
            setValue('imageUrl', bot.imageUrl);
          }
        });
      }
    }
  }, [router, editing, setValue]);

  const handleUpdateBot = (values: CreateBot) => {
    const id = router.query.id;
    if (typeof id !== 'string') return;
    const data: RawBotCreate = {
      name: values.name,
      bot_setting_id: values.botSettingId,
      type: values.type,
      status: values.status,
      price: values.price.toString(),
      currency: 'USD',
      description: values.description,
      order: values.order,
      work_based_on: values.workBasedOn,
      image_url: values.imageUrl,
    };

    return updateBot(id, data)
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

  const handleCreateBot = (values: CreateBot) => {
    const data: RawBotCreate = {
      name: values.name,
      bot_setting_id: values.botSettingId,
      type: values.type,
      status: values.status,
      price: values.price.toString(),
      currency: 'USD',
      description: values.description,
      order: values.order,
      work_based_on: values.workBasedOn,
      image_url: values.imageUrl,
    };
    return createBot(data)
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

  async function onSubmit(values: CreateBot) {
    if (editing) {
      await handleUpdateBot(values);
    } else {
      await handleCreateBot(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Bot listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit bot' : 'Create a bot'}
        </Heading>
        <InputField
          id="name"
          label="Name"
          placeholder="Enter name"
          required
          {...register('name')}
          error={errors.name?.message}
        />
        <SelectField
          id="botSettingId"
          label="Bot Setting Id"
          required
          {...register('botSettingId')}
          error={errors.botSettingId?.message}
        >
          <>
            <option value={''} disabled>
              Choose bot
            </option>
            {listBotOptions.map((bot) => {
              return (
                <option
                  key={bot.value}
                  value={bot.value}
                  selected={bot.value === botSettingId}
                >
                  {bot.label}
                </option>
              );
            })}
          </>
        </SelectField>
        <InputField
          id="type"
          label="Type"
          placeholder="Enter type"
          required
          {...register('type')}
          error={errors.type?.message}
        />
        <SelectField
          id="status"
          label="Status"
          required
          {...register('status')}
          error={errors.status?.message}
        >
          <>
            <option value={''} disabled>
              Choose status
            </option>
            {Object.keys(BotStatus).map((key) => {
              return (
                <option
                  key={BotStatus[key as keyof typeof BotStatus]}
                  value={BotStatus[key as keyof typeof BotStatus]}
                >
                  {BotStatus[key as keyof typeof BotStatus]}
                </option>
              );
            })}
          </>
        </SelectField>

        <InputField
          id="price"
          label="Price"
          placeholder="Enter price"
          required
          {...register('price')}
          error={errors.price?.message}
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
          id="order"
          label="Order"
          placeholder="Enter order"
          required
          {...register('order')}
          error={errors.order?.message}
        />
        <FormControl mb="12px" isInvalid={Boolean(errors.workBasedOn?.message)}>
          <FormLabel display={'flex'} fontWeight={600} htmlFor={'workBasedOn'}>
            Work base on
            <Text color="red.500">*</Text>
          </FormLabel>
          <HStack spacing={4} marginBottom={4} wrap="wrap" align="start">
            {workBasedOn.map((w, index) => (
              <Tag
                key={w}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
                marginBottom={2}
              >
                <TagLabel>{w}</TagLabel>
                <TagCloseButton
                  onClick={() => handleDeleteWorkBasedOn(index)}
                />
              </Tag>
            ))}
          </HStack>
          <InputGroup size="md">
            <Input
              id={'workBasedOn'}
              ref={inputRef}
              placeholder={'Enter work base on'}
              onKeyDown={handleKeydownWorkBasedOn}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="lg" onClick={handleAddWorkBasedOn}>
                Add
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.workBasedOn?.message && errors.workBasedOn?.message}
          </FormErrorMessage>
        </FormControl>
        {/* <InputField
          id="imageUrl"
          label="Image URL"
          placeholder="Enter imageUrl"
          required
          {...register('imageUrl')}
          error={errors.imageUrl?.message}
        /> */}
        <Text fontSize="md" fontWeight="bold" me="10px" mb="5px">
          Logo
        </Text>
        <Flex>
          <Image
            borderRadius="full"
            boxSize="70px"
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
