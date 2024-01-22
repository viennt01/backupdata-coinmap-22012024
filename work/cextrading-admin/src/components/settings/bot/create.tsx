import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Box,
  useColorModeValue,
  Flex,
  Text,
  SelectField,
  Tooltip,
} from '@chakra-ui/react';
import { isNotEmpty, useYupValidationResolver } from 'utils';
import { validationSchema, dataValid } from './validate';
import { CreateBot, Bot, ParamBot, TypeValue } from './interface';
import InputField from 'components/form/input-field';
import TextareaField from 'components/form/textarea-field';
import {
  createBot,
  editBot,
  getBot,
  normalizeBot,
  RawBotCreate,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BackButton from 'components/back-btn';
import React from 'react';
import { HiPlus, HiTrash } from 'react-icons/hi';

interface Props {
  editing?: boolean;
}

export default function CreateBotPage({ editing }: Props) {
  const resolver = useYupValidationResolver<CreateBot>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateBot>({
    resolver,
    defaultValues: {
      name: '',
      params: {},
      status: true,
    },
  });
  const toast = useToastHook();
  const router = useRouter();
  const [bot, setBot] = useState<Bot | null>(null);
  const [params, setParams] = useState<ParamBot[]>([]);
  const [submitError, setSubmitError] = useState<boolean>(false);

  const typeOptions = Object.values(TypeValue);
  const booleanOptions = ['true', 'false'];
  useEffect(() => {
    if (editing) {
      const id = router.query.id;
      if (id) {
        getBot(id as Bot['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const bots = normalizeBot([res.payload]);
            setBot(bots[0]);
            setValue('name', bots[0].name);
            setValue('params', bots[0].params);
            setValue('status', bots[0].status);
            const paramsArray = formatParamsObjectToArray(bots[0].params);
            setParams(paramsArray);
          }
        });
      }
    }
  }, [router, editing, setValue]);

  const handleUpdateBot = (values: CreateBot) => {
    const id = router.query.id;
    if (!bot || typeof id !== 'string') return;
    const data: RawBotCreate = {
      name: values.name,
      params: values.params,
      status: values.status,
    };

    return editBot(id, data)
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
      params: values.params,
      status: values.status,
    };
    return createBot(data)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          setParams([]);
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
    const paramsObject = formatParamsArrayToObject(params);
    if (paramsObject) {
      values.params = paramsObject;
      if (editing) {
        await handleUpdateBot(values);
      } else {
        await handleCreateBot(values);
      }
    }
  }
  const bg = useColorModeValue('white', 'gray.700');

  function onChangeValue(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) {
    const tempParams = [...params];
    switch (key) {
      case 'name':
        tempParams[index].name = event.target.value;
        setParams(tempParams);
        break;
      case 'order':
        tempParams[index].order = Number(event.target.value);
        setParams(tempParams);
        break;
      case 'default':
        if (tempParams[index].type === TypeValue.NUMBER) {
          tempParams[index].default = Number(event.target.value);
        } else {
          tempParams[index].default = event.target.value;
        }
        setParams(tempParams);
        break;
    }
  }
  function onChangeValueBoolean(
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const tempParams = [...params];
    tempParams[index].default = event.target.value === 'true' ? true : false;
    setParams(tempParams);
  }
  function onChangeType(
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const tempParams = [...params];
    tempParams[index].type = event.target.value as TypeValue;
    if (event.target.value === TypeValue.BOOLEAN) {
      tempParams[index].default = true;
    }
    setParams(tempParams);
  }
  function formatParamsObjectToArray(parmasBot: Bot['params']): ParamBot[] {
    return Object.keys(parmasBot).map((key) => {
      let defaultValue = parmasBot[key].default;
      if (
        typeof defaultValue !== 'number' &&
        typeof defaultValue !== 'string' &&
        typeof defaultValue !== 'boolean'
      ) {
        defaultValue = JSON.stringify(defaultValue, undefined, 2);
      }
      return {
        order: parmasBot[key].order,
        name: parmasBot[key].name,
        default: defaultValue,
        type: parmasBot[key].type,
      };
    });
  }
  function formatParamsArrayToObject(
    parmasBot: ParamBot[],
  ): Bot['params'] | null {
    const tempParams: Bot['params'] = {};
    let error = false;
    parmasBot.forEach((e) => {
      if (e.name) {
        const key = e.name.replace(/ /g, '_').toLowerCase();
        if (isNotEmpty(e.default)) {
          let valueDefault = e.default;
          if (e.type === TypeValue.NUMBER) {
            valueDefault = Number(e.default);
          } else if (e.type === TypeValue.BOOLEAN) {
            valueDefault =
              e.default === 'true' || e.default === true ? true : false;
          } else if (e.type !== TypeValue.TEXT) {
            try {
              const data = JSON.parse(e.default);
              valueDefault = data;
              if (
                e.type === TypeValue.OBJECT &&
                (typeof valueDefault !== 'object' || valueDefault.length)
              ) {
                error = true;
              } else if (e.type === TypeValue.ARRAY && !valueDefault.length) {
                error = true;
              }
            } catch (err) {
              error = true;
            }
          }
          tempParams[key] = {
            order: e.order,
            name: e.name,
            default: valueDefault,
            type: e.type,
          };
        } else {
          error = true;
        }
      }
    });
    setSubmitError(error);
    return error ? null : tempParams;
  }
  function addNewParam() {
    const tempParams = [...params];
    tempParams.push({
      order: params.length,
      name: '',
      default: '',
      type: TypeValue.NUMBER,
    });
    setParams(tempParams);
  }
  function deleteParam(index: number) {
    const tempParams = [...params];

    tempParams.splice(index, 1);
    setParams(tempParams);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Bot listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit bot' : 'Create a new bot'}
        </Heading>
        <InputField
          id="name"
          label="Name"
          placeholder="Enter name"
          required
          {...register('name')}
          error={errors.name?.message}
        />
        <Text fontSize="xl" fontWeight="bold">
          Params:
        </Text>
        <Flex direction="column">
          {params.map((p, i) => {
            return (
              <Flex key={i}>
                <Flex direction="column" flex="0">
                  <Tooltip label={p.order} fontSize="md">
                    <InputField
                      type="number"
                      value={p.order}
                      width="60px"
                      marginRight="7px"
                      textOverflow="ellipsis"
                      onChange={(event) => onChangeValue(i, event, 'order')}
                    />
                  </Tooltip>
                </Flex>
                <Flex direction="column" flex="1">
                  <InputField
                    placeholder="Enter name"
                    required
                    value={p.name}
                    onChange={(event) => onChangeValue(i, event, 'name')}
                  />
                  {submitError && !p.name && (
                    <Text fontSize="sm" color="red.500" pl="1">
                      Name of param must be required
                    </Text>
                  )}
                </Flex>
                <Text fontSize="xl" fontWeight="bold" mr="1.5" ml="1.5" pb="3">
                  :
                </Text>
                <Flex direction="column" flex="1">
                  {p.type === TypeValue.BOOLEAN ? (
                    <SelectField
                      border="1px solid"
                      borderColor="inherit"
                      borderRadius="7px"
                      padding="9px"
                      value={p.default}
                      onChange={(event) => onChangeValueBoolean(i, event)}
                    >
                      {booleanOptions.map((type) => {
                        return (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        );
                      })}
                    </SelectField>
                  ) : p.type === TypeValue.TEXT ||
                    p.type === TypeValue.NUMBER ? (
                    <InputField
                      type={p.type}
                      placeholder="Enter default"
                      required
                      value={`${p.default}`}
                      onChange={(event) => onChangeValue(i, event, 'default')}
                    />
                  ) : (
                    <TextareaField
                      placeholder="Enter default"
                      required
                      value={`${p.default}`}
                      onChange={(event: any) =>
                        onChangeValue(i, event, 'default')
                      }
                    />
                  )}
                  {submitError && !dataValid(p.default, p.type) && (
                    <Text fontSize="sm" color="red.500" pl="1">
                      Value is invalid
                    </Text>
                  )}
                </Flex>
                <Flex pb="3" pl="1.5">
                  <SelectField
                    id="type"
                    required
                    border="1px solid"
                    borderColor="inherit"
                    borderRadius="7px"
                    value={p.type}
                    onChange={(event) => onChangeType(i, event)}
                  >
                    {typeOptions.map((type) => {
                      return (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </SelectField>
                </Flex>
                <Button
                  onClick={() => deleteParam(i)}
                  p="0px"
                  variant="no-hover"
                  pb="3"
                >
                  <HiTrash />
                </Button>
              </Flex>
            );
          })}
          <Button bg="teal.300" rightIcon={<HiPlus />} onClick={addNewParam}>
            Add new param
          </Button>
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
