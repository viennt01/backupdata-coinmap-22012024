import { useForm } from 'react-hook-form';
import React from 'react';
import {
  Button,
  Heading,
  Box,
  Grid,
  GridItem,
  Text,
  Divider,
  Flex,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import InputField from 'components/form/input-field';
import TextareaField from 'components/form/textarea-field';
import {
  RawUserCreate,
  createUser,
  RawUserList,
  getUser,
  normalizeUser,
  updateUser,
  RawUserRole,
  addRoleToUser,
  getRoleByUser,
  RawUser,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { ERROR_CODE } from 'fetcher/interface';
import { useEffect, useState } from 'react';
import BackButton from 'components/back-btn';
import CheckboxField from 'components/form/checkbox-field';
import { User, UserCreate } from './interface';
import { useRouter } from 'next/router';
import {
  getRolePKGBot,
  getSbot,
  getTbot,
  normalizeRole,
  RawRole,
} from 'components/user/role/fetcher';
import { BotListPayload } from 'components/user/role/interface';
import { MESSAGE } from 'constants/message';
import useMyAbility from 'hook/ability';
import CreateUserAsset from './user-asset';
import { format } from 'date-fns';

interface Props {
  editing?: boolean;
}

export default function CreateUser({ editing }: Props) {
  const resolver = useYupValidationResolver<UserCreate>(validationSchema);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserCreate>({
    resolver,
    defaultValues: {
      roleIds: [],
      active: false,
      isAdmin: false,
    },
  });

  const ability = useMyAbility();
  const toast = useToastHook();
  const router = useRouter();
  const [userRoles, setUserRoles] = useState<RawRole[] | null>(null);
  const [sbotList, setSbotList] = useState<BotListPayload[] | null>(null);
  const [tbotList, setTbotList] = useState<BotListPayload[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // const [usersRoles, setUsersRoles] = useState<Role[] | null>(null);
  const [visible, setVisibleModal] = useState(false);
  const [createUserAsset, setCreateUserAsset] = useState('');
  const [userId, setUserIdt] = useState('');
  const [category, setCategory] = useState('');
  const [assetId, setAssetId] = useState('');
  const fetchUserRoles = (userId: string) => {
    getRolePKGBot(userId)
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setUserRoles(res.payload);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const fetchSbot = (userId: string) => {
    getSbot(userId)
      .then((res) => {
        //200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setSbotList(res.payload);
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };
  const fetchTbot = (userId: string) => {
    getTbot(userId)
      .then((res) => {
        //200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setTbotList(res.payload);
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
    if (editing) {
      const userId = router.query.id;
      if (userId) {
        //fetch Role PKG Bot
        fetchUserRoles(userId as RawUserList['id']);
        setUserIdt(userId as RawUserList['id']);
        // fetch Sbot
        fetchSbot(userId as RawUserList['id']);
        //fetch Tbot
        fetchTbot(userId as RawUserList['id']);
        getRoleByUser(userId as RawUserList['id']).then((res) => {
          //check res
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const usersRoles = normalizeRole(res.payload);
            //check uerRole
            setValue(
              'roleIds',
              usersRoles.map((r) => r.id),
            );
          }
        });
        getUser(userId as RawUser['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const user = normalizeUser(res.payload);
            // setUsersRoles(user.roles);
            setUser(user);
            setValue('phone', user.phone || '');
            setValue('firstName', user.firstName || '');
            setValue('lastName', user.lastName || '');
            setValue('address', user.address || '');
            setValue('affiliateCode', user.affiliateCode || '');
            setValue('linkAffiliate', user.linkAffiliate || '');
            setValue('referralCode', user.referralCode || '');
            setValue('profilePic', user.profilePic || '');
            setValue('noteUpdated', user.noteUpdated || '');
            setValue('active', user.active);
            setValue('isAdmin', user.isAdmin);
            setValue('email', user.email);

            // setValue('featureIds', role[0].root.features.map(f => f.featureId))
          }
        });
      }
    }
  }, [router, isSubmitting, visible]);

  const handleCreateUser = (values: UserCreate) => {
    // create user => add role to user
    const user: RawUserCreate = {
      phone: values.phone,
      first_name: values.firstName,
      last_name: values.lastName,
      address: values.address,
      affiliate_code: values.affiliateCode,
      link_affiliate: values.linkAffiliate,
      referral_code: values.referralCode,
      profile_pic: values.profilePic,
      note_updated: values.noteUpdated,
      active: values.active,
      is_admin: values.isAdmin,
      email: values.email,
    };

    return createUser(user)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          // add role to user
          const roles = values.roleIds
            .filter((f) => f)
            .reduce<RawUserRole['roles']>((prev, curr) => {
              const exist = (userRoles || []).find((rf) => rf.id === curr);
              if (exist) {
                prev.push({
                  description: exist.description,
                  role_id: exist.id,
                });
              }
              return prev;
            }, []);
          const data: RawUserRole = {
            user_id: res.payload.id,
            roles: roles,
          };
          return addRoleToUser(data)
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
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  const handleEditUser = (values: UserCreate) => {
    const userId = router.query.id;

    if (!userId) return;
    // edit role song song edit feature role
    const user: Omit<RawUserCreate, 'email'> = {
      phone: values.phone,
      first_name: values.firstName,
      last_name: values.lastName,
      address: values.address,
      affiliate_code: values.affiliateCode,
      link_affiliate: values.linkAffiliate,
      referral_code: values.referralCode,
      profile_pic: values.profilePic,
      note_updated: values.noteUpdated,
      active: values.active,
      is_admin: values.isAdmin,
    };

    return updateUser(user, userId as RawUserList['id'])
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          // add role to user
          const roles = values.roleIds
            .filter((f) => f)
            .reduce<RawUserRole['roles']>((prev, curr) => {
              const exist = (userRoles || []).find((rf) => rf.id === curr);
              if (exist) {
                prev.push({
                  description: exist.description,
                  role_id: exist.id,
                });
              }
              return prev;
            }, []);
          const data: RawUserRole = {
            user_id: userId as RawUserRole['user_id'],
            roles: roles,
          };
          return addRoleToUser(data)
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
        }
      })
      .catch((err) => {
        toast({
          description: JSON.parse(err.message).message,
          status: STATUS.ERROR,
        });
      });
  };

  async function onSubmit(values: UserCreate) {
    if (editing) {
      await handleEditUser(values);
    } else {
      await handleCreateUser(values);
    }
  }

  const active = watch('active');
  const isAdmin = watch('isAdmin');
  // const roleIds = watch('roleIds');
  const profilePic = watch('profilePic') || '/images/favicon-96x96.png';
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="User listing" />
      <Box bg={bg} p="20px" borderRadius={15} mb={4}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit user' : '  Create a new user'}
        </Heading>
        <GridItem colSpan={6}>
          <Image
            borderRadius="full"
            boxSize="80px"
            src={profilePic}
            alt=""
            mr="10px"
          />
        </GridItem>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={6}>
            <InputField
              disabled={user && user.isAdmin ? true : false}
              id="firstName"
              label="First name"
              placeholder="Enter first name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              disabled={user && user.isAdmin ? true : false}
              id="lastName"
              label="Last name"
              placeholder="Enter last name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              id="email"
              label="Email"
              placeholder="Enter email"
              required
              disabled={editing}
              {...register('email')}
              error={errors.email?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              disabled={user && user.isAdmin ? true : false}
              id="address"
              label="Address"
              placeholder="Enter address"
              {...register('address')}
              error={errors.address?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              disabled={user && user.isAdmin ? true : false}
              id="phone"
              label="Phone"
              placeholder="Enter phone"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              disabled={user && user.isAdmin ? true : false}
              id="affiliateCode"
              label="Affiliate Code"
              placeholder="Enter affiliate code"
              {...register('affiliateCode')}
              error={errors.affiliateCode?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              disabled={user && user.isAdmin ? true : false}
              id="linkAffiliate"
              label="Link Affiliate"
              placeholder="Enter link affiliate"
              {...register('linkAffiliate')}
              error={errors.linkAffiliate?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              disabled={user && user.isAdmin ? true : false}
              id="referralCode"
              label="Referral Code"
              placeholder="Enter referral code"
              {...register('referralCode')}
              error={errors.referralCode?.message}
            />
          </GridItem>
          <GridItem colSpan={12}>
            <TextareaField
              disabled={user && user.isAdmin ? true : false}
              id="noteUpdated"
              label="Note Updated"
              placeholder="Enter note updated"
              {...register('noteUpdated')}
              error={errors.noteUpdated?.message}
            />
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          {/* {userRoles &&
            userRoles.map((r, i) => {
              const checked = roleIds.some((rf) => rf === r.id);
              const role = usersRoles?.find((ur) => ur.id === r.id);
              return (
                <GridItem colSpan={4} key={`${r.id}-${i}`}>
                  <CheckboxField
                    value={r.id}
                    isChecked={checked}
                    onChange={(e) => {
                      let roles = roleIds;
                      if (e.target.checked) {
                        const existed = roles.some((r) => r === e.target.value);
                        if (existed) {
                          roles = roles.filter((r) => r !== e.target.value);
                        } else {
                          roles = [...roles, e.target.value];
                        }
                      } else {
                        roles = roles.filter((r) => r !== e.target.value);
                      }
                      setValue('roleIds', roles);
                    }}
                  >
                    {r.roleName}{' '}
                    {checked ? `(${role?.expiresAt || 'Unlimited'})` : ''}
                  </CheckboxField>
                </GridItem>
              );
            })} */}
          {userRoles && (
            <>
              <GridItem colSpan={12}>
                <Flex>
                  <Text fontWeight={600}>Role </Text>
                  <Text color="red.500">*</Text>
                </Flex>
              </GridItem>

              {userRoles.map((r, i) => {
                return (
                  <GridItem colSpan={4} key={`${r?.id}-${i}`}>
                    <CheckboxField
                      value={r?.id}
                      isChecked={
                        r?.expires_at || r?.expires_at === null ? true : false
                      }
                      onChange={() => {
                        setVisibleModal(true);
                        r?.expires_at
                          ? setCreateUserAsset('detele')
                          : setCreateUserAsset('create');
                        setCategory('PKG');
                        setAssetId(r?.id);
                      }}
                    >
                      {r?.role_name}
                      {''}
                      {r?.expires_at
                        ? `(${
                            format(Number(r?.expires_at), 'HH:mm dd/MM/yyyy') ||
                            'Unlimited'
                          })`
                        : ''}
                    </CheckboxField>
                  </GridItem>
                );
              })}
            </>
          )}
          {tbotList && (
            <>
              <GridItem colSpan={12}>
                <Flex>
                  <Text fontWeight={600}>Tbot </Text>
                  <Text color="red.500">*</Text>
                </Flex>
              </GridItem>
              {tbotList.map((r, i) => {
                return (
                  <GridItem colSpan={4} key={`${r?.id}-${i}`}>
                    <CheckboxField
                      value={r?.id}
                      isChecked={
                        r?.expires_at || r?.expires_at === null ? true : false
                      }
                      onChange={() => {
                        setVisibleModal(true);
                        r?.expires_at
                          ? setCreateUserAsset('delete')
                          : setCreateUserAsset('create');
                        setCategory('TBOT');
                        setAssetId(r?.id);
                      }}
                    >
                      {r?.name}
                      {''}
                      {r?.expires_at
                        ? `(${
                            format(Number(r?.expires_at), 'HH:mm dd/MM/yyyy') ||
                            'Unlimited'
                          })`
                        : ''}
                    </CheckboxField>
                    <Flex align="center" justify="end" mb="20px">
                      <CreateUserAsset
                        open={visible}
                        setVisibleModal={setVisibleModal}
                        create={createUserAsset}
                        userId={userId}
                        category={category}
                        assetId={assetId}
                      />
                    </Flex>
                  </GridItem>
                );
              })}
            </>
          )}
          {sbotList && (
            <>
              <GridItem colSpan={12}>
                <Flex>
                  <Text fontWeight={600}>Sbot </Text>
                  <Text color="red.500">*</Text>
                </Flex>
              </GridItem>
              {sbotList.map((r, i) => {
                return (
                  <GridItem colSpan={4} key={`${r?.id}-${i}`}>
                    <CheckboxField
                      value={r?.id}
                      isChecked={
                        r?.expires_at || r?.expires_at === null ? true : false
                      }
                      onChange={() => {
                        setVisibleModal(true);
                        r?.expires_at
                          ? setCreateUserAsset('detele')
                          : setCreateUserAsset('create');
                        setCategory('SBOT');
                        setAssetId(r?.id);
                      }}
                    >
                      {r?.name}
                      {''}
                      {r?.expires_at
                        ? `(${
                            format(Number(r?.expires_at), 'HH:mm dd/MM/yyyy') ||
                            'Unlimited'
                          })`
                        : ''}
                    </CheckboxField>
                  </GridItem>
                );
              })}
            </>
          )}
          <GridItem colSpan={12}>
            <Text color="red.500" fontSize={14}>
              {errors.roleIds && errors.roleIds?.message}
            </Text>
          </GridItem>
          <GridItem colSpan={12}>
            <Divider />
          </GridItem>
          <GridItem colSpan={1}>
            <CheckboxField
              disabled={user && user.isAdmin ? true : false}
              isChecked={active}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('active', true);
                } else {
                  setValue('active', false);
                }
              }}
            >
              Active?
            </CheckboxField>
          </GridItem>
          {ability.can('ROLE', ability.permissions.UPDATE_ADMIN) && (
            <GridItem colSpan={1}>
              <CheckboxField
                isChecked={isAdmin}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue('isAdmin', true);
                  } else {
                    setValue('isAdmin', false);
                  }
                }}
              >
                Admin?
              </CheckboxField>
            </GridItem>
          )}
        </Grid>

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
