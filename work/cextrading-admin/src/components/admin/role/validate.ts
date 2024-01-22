import * as yup from 'yup';

export const validationSchema = yup.object({
  roleName: yup.string().required('Name must be required'),
  description: yup.string().required('Description must be required'),
  permissionIds: yup.array().required('Action must be required'),
});
