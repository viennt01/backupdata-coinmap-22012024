import * as yup from 'yup';

export const validationSchema = yup.object({
  featureName: yup.string().required('Name must be required'),
  description: yup.string().required('Description must be required'),
  action: yup.string().required('Action must be required'),
});
