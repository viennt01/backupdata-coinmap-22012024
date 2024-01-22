import * as yup from 'yup';

export const validationSchema = yup.object({
  resolutionsName: yup.string().required('Name must be required'),
  displayName: yup.string().required('Display name must be required'),
});
