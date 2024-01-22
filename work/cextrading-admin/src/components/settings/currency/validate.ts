import * as yup from 'yup';

export const validationSchema = yup.object({
  name: yup.string().required('Name must be required'),
  description: yup.string().required('Description must be required'),
  currency: yup.string().required('Code must be required'),
  imageUrl: yup.string().required('Image must be required'),
});
