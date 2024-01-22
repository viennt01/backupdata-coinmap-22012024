import * as yup from 'yup';

export const validationSchema = yup.object({
  exchangeName: yup.string().required('Name must be required'),
  exchangeDesc: yup.string().required('Description must be required'),
});
