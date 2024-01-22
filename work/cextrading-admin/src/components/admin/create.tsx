import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Box,
  Grid,
  GridItem,
  Divider,
  Flex,
  Image,
} from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import InputField from 'components/form/input-field';
import SelectMultipleField from 'components/form/select-multiple-field';
import TextareaField from 'components/form/textarea-field';
import {
  addRoleToAdmin,
  createAdmin,
  getAdmin,
  getRoleByAdmin,
  normalizeAdmin,
  RawAdminCreate,
  RawAdminList,
  RawAdminRole,
  updateAdmin,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { ERROR_CODE } from 'fetcher/interface';
import React, { useEffect, useState, useMemo } from 'react';
import BackButton from 'components/back-btn';
import CheckboxField from 'components/form/checkbox-field';
import { AdminCreate } from './interface';
import { useRouter } from 'next/router';
import { Role } from 'components/admin/role/interface';
import { MESSAGE } from 'constants/message';
import { getAdminRoles, normalizeAdminRole } from './role/fetcher';
import { useBgWhite } from 'components/hook';

interface Props {
  editing?: boolean;
}

export default function CreateAdmin({ editing }: Props) {
  const resolver = useYupValidationResolver<AdminCreate>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreate>({
    resolver,
    defaultValues: {
      roleIds: [],
      active: false,
      isAdmin: true,
    },
  });

  const toast = useToastHook();
  const router = useRouter();
  const [adminRoles, setAdminRoles] = useState<Role[]>([]);

  const fetchAdminRoles = () => {
    getAdminRoles()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const roles = normalizeAdminRole(res.payload);
          setAdminRoles(roles);
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
    fetchAdminRoles();
    if (editing) {
      const adminId = router.query.id;
      if (adminId) {
        getRoleByAdmin(adminId as RawAdminList['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const userRoles = normalizeAdminRole(res.payload);
            setValue(
              'roleIds',
              userRoles.map((r) => r.id),
            );
          }
        });
        getAdmin(adminId as RawAdminList['id']).then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            const user = normalizeAdmin(res.payload);
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
  }, [router]);

  const handleCreateUser = (values: AdminCreate) => {
    // create user => add role to user
    const admin: RawAdminCreate = {
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

    return createAdmin(admin)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          // add role to user
          const adminId = res.payload.id;

          const adminRoleData = values.roleIds
            .filter((f) => f)
            .reduce<RawAdminRole['auth_roles']>((prev, curr) => {
              const exist = (adminRoles || []).find((rf) => rf.id === curr);
              if (exist) {
                prev.push({
                  description: exist.description,
                  auth_role_id: exist.id,
                });
              }
              return prev;
            }, []);
          const data: RawAdminRole = {
            user_id: adminId,
            auth_roles: adminRoleData,
          };
          return addRoleToAdmin(data).then((res) => {
            if (res.error_code === ERROR_CODE.SUCCESS) {
              toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
              reset();
            }
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

  const handleEditUser = (values: AdminCreate) => {
    const adminId = router.query.id;

    if (!adminId) return;
    // edit role song song edit feature role
    const user: Omit<RawAdminCreate, 'email'> = {
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

    return updateAdmin(user, adminId as RawAdminList['id'])
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          // add role to user

          const adminRoleData = values.roleIds
            .filter((f) => f)
            .reduce<RawAdminRole['auth_roles']>((prev, curr) => {
              const exist = (adminRoles || []).find((rf) => rf.id === curr);
              if (exist) {
                prev.push({
                  description: exist.description,
                  auth_role_id: exist.id,
                });
              }
              return prev;
            }, []);
          const data: RawAdminRole = {
            user_id: adminId as RawAdminList['id'],
            auth_roles: adminRoleData,
          };
          return addRoleToAdmin(data).then((res) => {
            if (res.error_code === ERROR_CODE.SUCCESS) {
              toast({ description: MESSAGE.SUCCESS, status: STATUS.SUCCESS });
            }
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

  async function onSubmit(values: AdminCreate) {
    if (editing) {
      await handleEditUser(values);
    } else {
      await handleCreateUser(values);
    }
  }

  const profilePic = watch('profilePic') || '/images/favicon-96x96.png';
  const isAdmin = watch('isAdmin');
  const active = watch('active');
  const roleIds = watch('roleIds');
  const bg = useBgWhite();

  const adminRoleOptions = useMemo(
    () =>
      adminRoles.map((adminRole) => {
        return {
          label: adminRole.roleName,
          value: adminRole.id,
        };
      }),
    [adminRoles],
  );

  const adminRolesIdsSelected = useMemo(
    () =>
      adminRoles
        .filter((res) => roleIds.includes(res.id))
        .map((adminRole) => {
          return {
            label: adminRole.roleName,
            value: adminRole.id,
          };
        }),
    [adminRoles, roleIds],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton label="Admin listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? 'Edit admin' : '  Create a new admin'}
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
              id="firstName"
              label="First name"
              placeholder="Enter first name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
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
              id="address"
              label="Address"
              placeholder="Enter address"
              {...register('address')}
              error={errors.address?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              id="phone"
              label="Phone"
              placeholder="Enter phone"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              id="affiliateCode"
              label="Affiliate Code"
              placeholder="Enter affiliate code"
              {...register('affiliateCode')}
              error={errors.affiliateCode?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              id="linkAffiliate"
              label="Link Affiliate"
              placeholder="Enter link affiliate"
              {...register('linkAffiliate')}
              error={errors.linkAffiliate?.message}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <InputField
              id="referralCode"
              label="Referral Code"
              placeholder="Enter referral code"
              {...register('referralCode')}
              error={errors.referralCode?.message}
            />
          </GridItem>

          <GridItem colSpan={12}>
            <TextareaField
              id="noteUpdated"
              label="Note Updated"
              placeholder="Enter note updated"
              {...register('noteUpdated')}
              error={errors.noteUpdated?.message}
            />
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          {adminRoles && (
            <GridItem colSpan={12}>
              <Flex>
                <SelectMultipleField
                  id="role"
                  label="Role"
                  placeholder="Enter role"
                  disabled={false}
                  error={errors.roleIds && errors.roleIds?.message}
                  required={true}
                  options={adminRoleOptions}
                  value={adminRolesIdsSelected}
                  setValue={(adminRolesSelected) => {
                    const adminRoleIdsSelected = adminRolesSelected.map((r) => {
                      return r.value;
                    });

                    setValue('roleIds', adminRoleIdsSelected);
                  }}
                />
              </Flex>
            </GridItem>
          )}
          <GridItem colSpan={12}>
            <Divider />
          </GridItem>
          <GridItem colSpan={1}>
            <CheckboxField
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
