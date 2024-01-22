import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Box,
  Grid,
  GridItem,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useYupValidationResolver } from 'utils';
import { validationSchema } from './validate';
import { CreateAdminRoleData, Permission } from './interface';
import InputField from 'components/form/input-field';
import TextareaField from 'components/form/textarea-field';
import {
  createRole,
  getAdminRole,
  getPermissions,
  normalizePermission,
  RawRole,
  RawRoleCreate,
  updateRole,
} from './fetcher';
import useToastHook, { STATUS } from 'components/hook/toast';
import { MESSAGE } from 'constants/message';
import { ERROR_CODE } from 'fetcher/interface';
import BackButton from 'components/back-btn';
import SelectMultipleField from 'components/form/select-multiple-field';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';

interface Props {
  editing?: boolean;
}

export default function CreateAdminRole({ editing }: Props) {
  const resolver =
    useYupValidationResolver<CreateAdminRoleData>(validationSchema);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminRoleData>({
    resolver,
    defaultValues: {
      roleName: '',
      description: '',
      permissionIds: [],
    },
  });

  const toast = useToastHook();
  const router = useRouter();
  const roleId = router.query.id;

  const [permissions, setPermissions] = useState<Permission[]>([]);

  const fetchPermissionList = () => {
    getPermissions().then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        const permissions = normalizePermission(res.payload);
        setPermissions(permissions);
      }
    });
  };

  const fetchRoleDetail = () => {
    getAdminRole(roleId as RawRole['id']).then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        setValue('roleName', res.payload.role_name);
        setValue('description', res.payload.description);
        setValue(
          'permissionIds',
          res.payload.root.permissions.map((p) => p.permission_id),
        );
      }
    });
  };

  useEffect(() => {
    fetchPermissionList();
    if (editing) {
      fetchRoleDetail();
    }
  }, []);

  const handleCreateRole = (values: CreateAdminRoleData) => {
    const data: RawRoleCreate = {
      permission_ids: values.permissionIds.filter((p) => p),
      role_name: values.roleName,
      description: values.description,
    };
    return createRole(data)
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

  const handleEditRole = (values: CreateAdminRoleData) => {
    const data: RawRoleCreate = {
      permission_ids: values.permissionIds.filter((p) => p),
      role_name: values.roleName,
      description: values.description,
    };
    return updateRole(data, roleId as RawRole['id'])
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

  function onSubmit(values: CreateAdminRoleData) {
    if (editing) {
      handleEditRole(values);
    } else {
      handleCreateRole(values);
    }
  }

  const permissionIds = watch('permissionIds');
  const bg = useColorModeValue('white', 'gray.700');

  const permissionOptions = useMemo(
    () =>
      permissions.map((permission) => {
        return {
          label: permission.permissionName,
          value: permission.permissionId,
        };
      }),
    [permissions],
  );

  const permissionIdsSelected = useMemo(
    () =>
      permissions
        .filter((res) => permissionIds.includes(res.permissionId))
        .map((permission) => {
          return {
            label: permission.permissionName,
            value: permission.permissionId,
          };
        }),
    [permissions, permissionIds],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackButton
        onClick={() => router.push('/admin#1')}
        label="Admin role listing"
      />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          {editing ? ' Edit a admin role' : ' Create a new admin role'}
        </Heading>
        <InputField
          id="roleName"
          label="Role name"
          placeholder="Enter role name"
          {...register('roleName')}
          error={errors.roleName?.message}
        />
        <TextareaField
          id="description"
          label="Description"
          placeholder="Enter description"
          {...register('description')}
          error={errors.description?.message}
        />
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          {permissions && (
            <GridItem colSpan={12}>
              <Flex>
                <SelectMultipleField
                  id="permission"
                  label="Permission"
                  placeholder="Enter permission"
                  disabled={false}
                  options={permissionOptions}
                  value={permissionIdsSelected}
                  setValue={(permissionsSelected) => {
                    const permissionIdsSelected = permissionsSelected.map(
                      (r) => {
                        return r.value;
                      },
                    );

                    setValue('permissionIds', permissionIdsSelected);
                  }}
                />
              </Flex>
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
