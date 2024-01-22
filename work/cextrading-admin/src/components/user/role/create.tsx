import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Box,
  useColorModeValue,
  Flex,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import InputField from 'components/form/input-field';
import TextareaField from 'components/form/textarea-field';
import {
  createFeatureRole,
  createGeneralRole,
  createRole,
  createSymbolRole,
  getRole,
  getRoles,
  normalizeRole,
  RawRole,
  RawRoleCreate,
  RawRoleFeatureCreate,
  RawRoleGeneralCreate,
  RawRoleSymbolCreate,
  updateRole,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { ERROR_CODE } from 'fetcher/interface';
import React, { useEffect, useState } from 'react';
import BackButton from 'components/back-btn';
import {
  getFeatures,
  normalizeFeature,
} from 'components/settings/feature/fetcher';
import { Feature } from 'components/settings/feature/interface';
import {
  getGenerals,
  normalizeGeneral,
} from 'components/settings/general/fetcher';
import { General } from 'components/settings/general/interface';

import {
  getExchanges,
  normalizeExchange,
} from 'components/settings/exchange/fetcher';
import { Exchange } from 'components/settings/exchange/interface';

import {
  getSymbols,
  normalizeSymbol,
} from 'components/settings/symbol/fetcher';
import { ISymbol } from 'components/settings/symbol/interface';
import {
  getResolutions,
  normalizeResolution,
} from 'components/settings/resolution/fetcher';
import { Resolution } from 'components/settings/resolution/interface';
import { CreateRole, Role, ROLE_STATUS, ROLE_TYPE } from './interface';
import { MESSAGE } from 'constants/message';
import { useRouter } from 'next/router';
import SettingsSection from './components/settings-section';
import SelectField from 'components/form/select-field';
import CheckboxField from 'components/form/checkbox-field';
const sellCurrencyDefault = 'USD';
interface Props {
  editing?: boolean;
}
export default function CreateFeature({ editing }: Props) {
  const resolver = useYupValidationResolver<CreateRole>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRole>({
    resolver,
    defaultValues: {
      roleName: '',
      description: '',
      featureIds: [],
      generalIds: [],
      exchangeIds: [],
      symbolIds: [],
      resolutionIds: [],
      valueLimit: [],
      type: '',
      price: '',
      currency: sellCurrencyDefault,
      parentId: '',
      isBestChoice: false,
      order: 0,
      descriptionFeatures: [],
      color: '',
    },
  });

  const toast = useToastHook();
  const router = useRouter();
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [generals, setGenerals] = useState<General[] | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[] | null>(null);
  const [symbols, setSymbols] = useState<ISymbol[] | null>(null);
  const [resolutions, setResolutions] = useState<Resolution[] | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const [descriptionFeature, setDescriptionFeature] = useState<string>('');

  const fetchFeatures = () => {
    getFeatures()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const features = normalizeFeature(res.payload);
          setFeatures(features);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const fetchGenerals = () => {
    getGenerals()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const generals = normalizeGeneral(res.payload);
          setGenerals(generals);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const fetchExchanges = () => {
    getExchanges()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const exchanges = normalizeExchange(res.payload);
          setExchanges(exchanges);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const fetchSymbols = () => {
    getSymbols()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const symbols = normalizeSymbol(res.payload);
          setSymbols(symbols);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const fetchResolutions = () => {
    getResolutions()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const resolutions = normalizeResolution(res.payload);
          setResolutions(resolutions);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const fetchRoles = () => {
    getRoles()
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const roles = normalizeRole(res.payload);
          const indexCurrentRole = roles.findIndex(
            (r) => r.id === router.query.id,
          );
          roles.splice(indexCurrentRole, 1);
          setRoles(roles);
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
    fetchFeatures();
    fetchGenerals();
    fetchExchanges();
    fetchSymbols();
    fetchResolutions();
    fetchRoles();
    if (editing) {
      const roleId = router.query.id;
      if (roleId) {
        getRole(roleId as RawRole['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const role = normalizeRole([res.payload]);
            setValue('roleName', role[0].roleName);
            setValue('description', role[0].description);
            setValue('type', role[0].type);
            setValue('price', role[0].price);
            setValue('currency', role[0].currency);
            setValue('status', role[0].status);
            setValue(
              'generalIds',
              role[0].root.generalSettings.map((f) => f.generalSettingId),
            );

            const exchangeIds = role[0].root.symbolSettingsRoles
              .reduce((p: string[], c) => {
                p = p.concat(c.exchanges.map((ex) => ex.exchangeName));

                return p;
              }, [])
              .filter((ex, index, a) => a.indexOf(ex) === index);
            const symbolIds = role[0].root.symbolSettingsRoles
              .reduce((p: string[], c) => {
                p = p.concat(c.symbols.map((ex) => ex.symbol));
                return p;
              }, [])
              .filter((s, index, a) => a.indexOf(s) === index);
            const resolutionIds = role[0].root.symbolSettingsRoles
              .reduce((p: string[], c) => {
                p = p.concat(c.resolutions.map((ex) => ex.id));
                return p;
              }, [])
              .filter((r, index, a) => a.indexOf(r) === index);
            const featureIds = role[0].root.features.map((f) => f.featureId);

            setValue('exchangeIds', exchangeIds);
            setValue('symbolIds', symbolIds);
            setValue('resolutionIds', resolutionIds);
            setValue('featureIds', featureIds);

            setValue(
              'valueLimit',
              role[0].root.generalSettings.map((f) => ({
                id: f.generalSettingId,
                value: f.valLimit.toString(),
              })),
            );

            setValue('isBestChoice', role[0].isBestChoice);
            setValue('order', role[0].order);
            setValue('descriptionFeatures', role[0].descriptionFeatures);
            setValue('parentId', role[0].parentId);
            setValue('status', role[0].status);
            setValue('color', role[0].color);
          }
        });
      }
    }
  }, [router]);
  const isBestChoice = watch('isBestChoice');
  const color = watch('color') || '';
  const handleSettingByRole = (values: CreateRole, roleId: Role['id']) => {
    // add general to role
    const generalData = values.generalIds.reduce<
      RawRoleGeneralCreate['general_settings']
    >((prev, curr) => {
      const exist = (generals || []).find((rf) => rf.generalSettingId === curr);
      if (exist) {
        prev.push({
          general_setting_id: exist.generalSettingId,
          description: exist.description,
          val_limit: Number(
            values.valueLimit.find((v) => v.id === exist.generalSettingId)
              ?.value,
          ),
        });
      }
      return prev;
    }, []);
    const dataGeneralRole: RawRoleGeneralCreate = {
      general_settings: generalData,
    };

    // add symbol to role
    const dataSymbolRole: RawRoleSymbolCreate = {
      list_symbol: values.symbolIds,
      list_exchanged: values.exchangeIds,
      supported_resolutions: values.resolutionIds,
      description: '',
    };

    // add feature to role
    const featureData = values.featureIds
      .filter((f) => f)
      .reduce<RawRoleFeatureCreate['features']>((prev, curr) => {
        const exist = (features || []).find((rf) => rf.featureId === curr);
        if (exist) {
          prev.push({
            description: exist.description,
            feature_id: exist.featureId,
          });
        }
        return prev;
      }, []);
    const data: RawRoleFeatureCreate = {
      features: featureData,
    };

    return Promise.all([
      createGeneralRole(dataGeneralRole, roleId),
      createFeatureRole(data, roleId),
      createSymbolRole(dataSymbolRole, roleId),
    ])
      .then((res) => {
        if (res.some((r) => r.error_code !== ERROR_CODE.SUCCESS)) {
          res.forEach((r) => {
            if (typeof JSON.parse(r.message).message === 'string') {
              toast({
                description: JSON.parse(r.message).message,
                status: STATUS.ERROR,
              });
            } else {
              toast({
                description: JSON.parse(r.message).message[0],
                status: STATUS.ERROR,
              });
            }
          });
        } else {
          toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
          if (!editing) {
            reset();
          }
        }
      })
      .catch((err) => {
        if (typeof JSON.parse(err.message).message === 'string') {
          toast({
            description: JSON.parse(err.message).message,
            status: STATUS.ERROR,
          });
        } else {
          toast({
            description: JSON.parse(err.message).message[0],
            status: STATUS.ERROR,
          });
        }
      });
  };

  const handleCreateRole = (values: CreateRole) => {
    // create role => add feature to role
    const role: RawRoleCreate = {
      role_name: values.roleName.trim(),
      description: values.description,
      type: values.type,
      price: values.price.trim(),
      currency: values.currency,
      description_features: values.descriptionFeatures,
      is_best_choice: values.isBestChoice,
      parent_id: values.parentId,
      status: values.status,
      color: values.color,
    };

    return createRole(role)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          // add general to role
          const roleId = res.payload[0].id;
          return handleSettingByRole(values, roleId);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const handleEditRole = (values: CreateRole) => {
    const roleId = router.query.id;

    if (!roleId) return;
    // edit role // edit feature role
    const role: RawRoleCreate = {
      role_name: values.roleName.trim(),
      description: values.description,
      type: values.type,
      price: values.price.trim(),
      currency: values.currency,
      description_features: values.descriptionFeatures,
      is_best_choice: values.isBestChoice,
      parent_id: values.parentId,
      status: values.status,
      color: values.color,
    };
    return updateRole(role, roleId as RawRole['id'])
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const roleId = res.payload[0].id;
          return handleSettingByRole(values, roleId);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const descriptionFeatures = watch('descriptionFeatures');
  function addDescriptionFeature() {
    if (descriptionFeature) {
      const newDescriptionFeatures = [...descriptionFeatures];
      newDescriptionFeatures.push(descriptionFeature);
      setValue('descriptionFeatures', newDescriptionFeatures);
      setDescriptionFeature('');
    }
  }
  function removeDescriptionFeature(index: number) {
    const newDescriptionFeatures = [...descriptionFeatures];
    newDescriptionFeatures.splice(index, 1);
    setValue('descriptionFeatures', newDescriptionFeatures);
  }
  const textBadgeColor = useColorModeValue('gray.700', 'white');
  const bgBadge = useColorModeValue('teal.300', '#1a202c');

  async function onSubmit(values: CreateRole) {
    if (editing) {
      await handleEditRole(values);
    } else {
      await handleCreateRole(values);
    }
  }

  const generalIds = watch('generalIds');
  const exchangeIds = watch('exchangeIds');
  const featureIds = watch('featureIds');
  const symbolIds = watch('symbolIds');
  const resolutionIds = watch('resolutionIds');
  const valueLimit = watch('valueLimit');
  const parentId = watch('parentId');

  const bg = useColorModeValue('white', 'gray.700');
  const typeOptions = Object.values(ROLE_TYPE);
  const statusOptions = Object.values(ROLE_STATUS);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Role listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit role' : '  Create a new role'}
        </Heading>
        <InputField
          id="roleName"
          label="Role name"
          placeholder="Enter role name"
          {...register('roleName')}
          required
          error={errors.roleName?.message}
        />
        <TextareaField
          id="description"
          label="Description"
          placeholder="Enter description"
          required
          {...register('description')}
          error={errors.description?.message}
        />
        <Flex direction="column">
          <Text fontWeight="bold" mb="3px">
            Features Display
          </Text>
          {descriptionFeatures.map((e, i) => {
            return (
              <Text key={i}>
                <Badge
                  p="7px"
                  borderRadius="5px"
                  margin={'5px'}
                  key={i}
                  bg={bgBadge}
                  color={textBadgeColor}
                  position="relative"
                >
                  {e}
                  <Badge
                    position="absolute"
                    top="-1"
                    cursor="pointer"
                    onClick={() => removeDescriptionFeature(i)}
                  >
                    x
                  </Badge>
                </Badge>
              </Text>
            );
          })}
          <Flex>
            <InputField
              value={descriptionFeature}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setDescriptionFeature(event.target.value)
              }
            />
            <Button
              ml="5"
              borderRadius="5px"
              colorScheme="teal"
              bg="teal.300"
              onClick={() => addDescriptionFeature()}
            >
              Add Feature
            </Button>
          </Flex>
        </Flex>
        <Flex direction="row" color={`${color}`}>
          <InputField
            id="color"
            label="Color display"
            placeholder="Enter color code"
            {...register('color')}
          />
        </Flex>
        <CheckboxField
          isChecked={isBestChoice}
          onChange={(e) => {
            if (e.target.checked) {
              setValue('isBestChoice', true);
            } else {
              setValue('isBestChoice', false);
            }
          }}
        >
          Is best choice?
        </CheckboxField>
        <SelectField id="parentId" label="Belong to" {...register('parentId')}>
          <option value="">No</option>
          {roles.length > 0 &&
            roles.map((r) => {
              return (
                <option key={r.id} value={r.id} selected={r.id === parentId}>
                  {r.roleName}
                </option>
              );
            })}
        </SelectField>
        <SelectField
          id="type"
          label="Type"
          required
          {...register('type')}
          error={errors.type?.message}
        >
          <option value="" disabled>
            Choose type
          </option>
          {typeOptions.map((type) => {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </SelectField>
        <SelectField
          id="status"
          label="Status"
          required
          {...register('status')}
          error={errors.status?.message}
        >
          <option value="" disabled>
            Choose status
          </option>
          {statusOptions.map((status) => {
            return (
              <option key={status} value={status}>
                {status}
              </option>
            );
          })}
        </SelectField>
        <InputField
          id="currency"
          label="Currency"
          required
          {...register('currency')}
          error={errors.currency?.message}
        />
        <InputField
          id="price"
          label="Price"
          placeholder="Enter price"
          {...register('price')}
          required
          error={errors.price?.message}
        />
        <SettingsSection
          generals={generals || []}
          generalIds={generalIds}
          exchanges={exchanges || []}
          exchangeIds={exchangeIds}
          features={features || []}
          featureIds={featureIds}
          symbols={symbols || []}
          symbolIds={symbolIds}
          resolutions={resolutions || []}
          resolutionIds={resolutionIds}
          valueLimit={valueLimit}
          setValue={setValue}
          errors={errors}
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
