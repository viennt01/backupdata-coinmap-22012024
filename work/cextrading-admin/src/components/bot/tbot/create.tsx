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
  Image,
  InputLeftElement,
  Grid,
  GridItem,
  Flex,
} from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { Bot, BotStatus, CreateBot } from './interface';
import InputField from 'components/form/input-field';
import {
  getBotDetail,
  // getListSettingBots,
  createBot,
  RawBotCreate,
  normalizeBot,
  updateBot,
  uploadCsvFile,
  Language,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import BackButton from 'components/back-btn';
import React from 'react';
import SelectField from 'components/form/select-field';
import { CheckCircleIcon } from '@chakra-ui/icons';
import FileUploader from './uploader';

interface Props {
  editing?: boolean;
  clone?: boolean;
  setFetchTradeHistory?: any;
  fetchTradeHistory?: boolean;
}

export default function CreateTBot({
  editing,
  setFetchTradeHistory,
  fetchTradeHistory,
  clone,
}: Props) {
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
      cloneName: '',
      code: '',
      type: '',
      status: '',
      price: '',
      displayPrice: null,
      currency: '',
      description: '',
      descriptionVI: '',
      order: 0,
      bought: 0,
      workBasedOn: [],
      workBasedOnVI: [],
      imageUrl: '',
      pnl: '',
      max_drawdown: '',
      balance: '',
      backTest: '',
      maxDrawdownChangePercent: 0,
    },
  });

  const toast = useToastHook();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputVIRef = useRef<HTMLInputElement | null>(null);
  const inputBacktestRef = useRef<HTMLInputElement | null>(null);
  const inputRefCsv = useRef<HTMLInputElement | null>(null);
  const [idBot, setIdBot] = useState('');

  const values = getValues();
  const workBasedOn = watch('workBasedOn');
  const workBasedOnVI = watch('workBasedOnVI');
  const imageUrl = watch('imageUrl');

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

  const handleKeydownWorkBasedOnVI = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (inputVIRef.current !== null) {
        const workBasedOnVI = values.workBasedOnVI;
        workBasedOnVI.push(event.currentTarget.value);
        setValue('workBasedOnVI', workBasedOnVI);
        inputVIRef.current.value = '';
      }
      return false;
    }
  };

  const handleAddWorkBasedOnVI = () => {
    if (inputVIRef.current !== null) {
      const workBasedOnVI = values.workBasedOnVI;
      workBasedOnVI.push(inputVIRef.current.value);
      setValue('workBasedOnVI', workBasedOnVI);
      inputVIRef.current.value = '';
    }
  };

  const handleDeleteWorkBasedOnVI = (index: number) => {
    let workBasedOnVI = values.workBasedOnVI;
    workBasedOnVI = workBasedOnVI.filter((_, i) => i !== index);
    setValue('workBasedOnVI', workBasedOnVI);
  };

  useEffect(() => {
    if (editing) {
      const id = router.query.id;
      if (id) {
        setIdBot(id as Bot['id']);
        getBotDetail(id as Bot['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const bot = normalizeBot(res.payload);
            setValue('name', bot.name);
            setValue('cloneName', bot.cloneName);
            setValue('code', bot.code);
            setValue('type', bot.type);
            setValue('status', bot.status);
            setValue('price', bot.price);
            setValue('displayPrice', bot.displayPrice);
            setValue('currency', bot.tokenFirst + bot.tokenSecond);
            setValue('description', bot.description);
            setValue('descriptionVI', bot.translation?.vi?.description);
            setValue('order', bot.order);
            setValue('bought', bot.bought);
            setValue('workBasedOn', bot.workBasedOn);
            setValue('workBasedOnVI', bot.translation?.vi?.workBasedOn || []);
            setValue('imageUrl', bot.imageUrl);
            setValue('pnl', bot.pnl);
            setValue('max_drawdown', bot.max_drawdown);
            setValue('tokenFirst', bot.tokenFirst);
            setValue('tokenSecond', bot.tokenSecond);
            setValue('balance', bot.balance);
            setValue('backTest', bot.backTest);
            setValue('maxDrawdownChangePercent', bot.maxDrawdownChangePercent);
          }
        });
      }
    }
  }, [router, editing, setValue]);

  const handleUpdateBot = (values: CreateBot) => {
    const id = router.query.id;
    if (typeof id !== 'string') return;
    const translation: RawBotCreate['translation'] = {
      [Language.VI]: {
        description: values.descriptionVI,
        work_based_on: values.workBasedOnVI,
      },
    };
    const data: RawBotCreate = {
      name: values.name,
      clone_name: values.cloneName,
      code: values.code,
      type: values.type,
      status: values.status,
      price: values.price.toString(),
      display_price: values.displayPrice || null,
      currency: values.tokenFirst + values.tokenSecond,
      description: values.description,
      order: values.order,
      bought: Number(values.bought),
      work_based_on: values.workBasedOn,
      image_url: values.imageUrl,
      pnl: values.pnl,
      max_drawdown: values.max_drawdown,
      token_first: values.tokenFirst,
      token_second: values.tokenSecond,
      balance: values.balance,
      back_test: values.backTest,
      max_drawdown_change_percent: values.maxDrawdownChangePercent,
      translation,
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
    const translation: RawBotCreate['translation'] = {
      [Language.VI]: {
        description: values.descriptionVI,
        work_based_on: values.workBasedOnVI,
      },
    };
    const data: RawBotCreate = {
      name: values.name,
      clone_name: values.cloneName,
      code: values.code,
      type: values.type,
      status: values.status,
      price: values.price.toString(),
      display_price: values.displayPrice || null,
      currency: values.tokenFirst + values.tokenSecond,
      description: values.description,
      order: values.order,
      bought: Number(values.bought),
      work_based_on: values.workBasedOn,
      image_url: values.imageUrl,
      pnl: values.pnl,
      max_drawdown: values.max_drawdown,
      token_first: values.tokenFirst,
      token_second: values.tokenSecond,
      balance: values.balance,
      back_test: values.backTest,
      max_drawdown_change_percent: values.maxDrawdownChangePercent,
      translation,
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
      if (clone) {
        await handleCreateBot(values);
      } else {
        await handleUpdateBot(values);
      }
    } else {
      await handleCreateBot(values);
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  function handleUploadCsv(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('bot_id', idBot);
      formData.append('file', file);
      return uploadCsvFile(formData)
        .then(() => {
          setFetchTradeHistory(!fetchTradeHistory);
        })
        .catch((err) => {
          toast({
            description: JSON.parse(err.message).message,
            status: STATUS.ERROR,
          });
        });
    }
  }

  const handleUploadBacktest = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const reader = new FileReader();
      const onReaderLoad = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setValue('backTest', event.target.result as string);
        }
      };
      reader.onload = onReaderLoad;
      reader.readAsText(event.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Bot listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? (clone ? 'Clone bot' : 'Edit bot') : 'Create a bot'}
        </Heading>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={6}>
            <InputField
              id="name"
              label="Name"
              placeholder="Enter name"
              required
              {...register('name')}
              error={errors.name?.message}
            />

            <InputField
              id="cloneName"
              label="Clone name"
              placeholder="Enter clone name"
              required
              {...register('cloneName')}
              error={errors.cloneName?.message}
            />

            <InputField
              id="code"
              label="Code"
              placeholder="Enter code"
              required
              {...register('code')}
              error={errors.code?.message}
            />

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
              id="max_drawdown"
              label="% Max drawdown"
              placeholder="Enter max drawdown"
              required
              {...register('max_drawdown')}
              type="number"
              min={0}
              max={1}
              error={errors.max_drawdown?.message}
            />

            <InputField
              id="balance"
              label="Balance"
              placeholder="Enter balance"
              required
              {...register('balance')}
              error={errors.balance?.message}
            />

            <InputField
              id="bought"
              label="People bought the bot"
              placeholder="Enter number"
              required
              {...register('bought')}
              type="number"
              error={errors.bought?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              id="token_first"
              label="Base symbol name"
              placeholder="Enter Base symbol name"
              required
              {...register('tokenFirst')}
              error={errors.tokenFirst?.message}
            />

            <InputField
              id="token_second"
              label="Quote Symbol name"
              placeholder="Enter Quote Symbol name"
              required
              {...register('tokenSecond')}
              error={errors.tokenSecond?.message}
            />

            <InputField
              id="displayPrice"
              label="Display price"
              placeholder="Enter display price"
              {...register('displayPrice')}
              error={errors.displayPrice?.message}
            />

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
              id="descriptionVI"
              label="Description VI"
              placeholder="Enter descriptionVI"
              required
              {...register('descriptionVI')}
              error={errors.descriptionVI?.message}
            />

            <InputField
              id="pnl"
              label="Pnl"
              placeholder="Enter pnl"
              required
              {...register('pnl')}
              error={errors.pnl?.message}
            />
            <InputField
              id="order"
              label="Order"
              placeholder="Enter order"
              required
              {...register('order')}
              error={errors.order?.message}
            />
            <InputField
              id="max_drawdown_change_percent"
              label="± % Max drawdown"
              placeholder="Enter number"
              required
              {...register('maxDrawdownChangePercent')}
              type="number"
              min={0}
              max={1}
              error={errors.maxDrawdownChangePercent?.message}
            />
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={6}>
            {editing && (
              <>
                <FormLabel
                  display={'flex'}
                  fontWeight={600}
                  htmlFor={'workBasedOn'}
                >
                  Import Tradehistory.csv
                </FormLabel>
                <InputGroup size="md">
                  <input
                    type="file"
                    ref={inputRefCsv}
                    onChange={handleUploadCsv}
                    style={{ marginTop: '5px', marginLeft: '21px' }}
                  />
                  <InputLeftElement
                    style={{
                      width: '125px',
                    }}
                  >
                    <Button
                      h="2.5rem"
                      size="md"
                      onClick={() => inputRefCsv.current.click()}
                    >
                      Choose a file
                    </Button>
                  </InputLeftElement>
                </InputGroup>
              </>
            )}
          </GridItem>
          <GridItem colSpan={6}>
            <FormLabel
              display={'flex'}
              alignItems="center"
              gap="2"
              fontWeight={600}
              htmlFor={'workBasedOn'}
            >
              Import backtest.json
              {values.backTest && <CheckCircleIcon color={'green'} />}
            </FormLabel>
            <InputGroup size="md">
              <input
                type="file"
                ref={inputBacktestRef}
                onChange={handleUploadBacktest}
                style={{ marginTop: '5px', marginLeft: '21px' }}
              />
              <InputLeftElement
                style={{
                  width: '125px',
                }}
              >
                <Button
                  h="2.5rem"
                  size="md"
                  onClick={() =>
                    inputBacktestRef.current && inputBacktestRef.current.click()
                  }
                >
                  Choose a file
                </Button>
              </InputLeftElement>
            </InputGroup>
          </GridItem>
        </Grid>

        <FormControl mb="12px" isInvalid={Boolean(errors.workBasedOn?.message)}>
          <FormLabel
            display={'flex'}
            fontWeight={600}
            htmlFor={'workBasedOn'}
            marginTop={'20px'}
          >
            Requirement
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
              placeholder={'Enter Requirement'}
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

        <FormControl
          mb="12px"
          isInvalid={Boolean(errors.workBasedOnVI?.message)}
        >
          <FormLabel
            display={'flex'}
            fontWeight={600}
            htmlFor={'workBasedOnVI'}
            marginTop={'20px'}
          >
            Requirement VI
            <Text color="red.500">*</Text>
          </FormLabel>
          <HStack spacing={4} marginBottom={4} wrap="wrap" align="start">
            {workBasedOnVI.map((w, index) => (
              <Tag
                key={w}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
                marginBottom={2}
              >
                <TagLabel>{w}</TagLabel>
                <TagCloseButton
                  onClick={() => handleDeleteWorkBasedOnVI(index)}
                />
              </Tag>
            ))}
          </HStack>
          <InputGroup size="md">
            <Input
              id={'workBasedOnVI'}
              ref={inputVIRef}
              placeholder={'Enter Requirement'}
              onKeyDown={handleKeydownWorkBasedOnVI}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="lg" onClick={handleAddWorkBasedOnVI}>
                Add
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.workBasedOnVI?.message && errors.workBasedOnVI?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mb="12px">
          <Flex mb="10px">
            <Text fontSize="md" fontWeight="bold">
              Logo
            </Text>
            <Text color={'red'}>*</Text>
          </Flex>
          <Image
            borderRadius="full"
            boxSize="70px"
            src={imageUrl}
            alt=""
            mr="10px"
            mb="10px"
          />
          <FileUploader
            setUrl={(url) => setValue('imageUrl', url)}
            url={imageUrl}
          />
        </FormControl>
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
