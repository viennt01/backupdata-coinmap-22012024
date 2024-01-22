import * as yup from 'yup';

export const validationSchema = yup.object({
  name: yup.string().required('Name must be required'),
  botSettingId: yup.string().required('botSettingId must be required'),
  type: yup.string().required('type must be required'),
  status: yup.string().required('status must be required'),
  price: yup
    .number()
    .typeError('price be a number')
    .required('price must be required'),
  currency: yup.string().required('currency must be required'),
  description: yup.string().required('description must be required'),
  order: yup
    .number()
    .typeError('price be a number')
    .required('price must be required'),
  workBasedOn: yup.array().min(1, 'workBasedOn must be required'),
  imageUrl: yup.string().required('imageUrl must be required'),
});
