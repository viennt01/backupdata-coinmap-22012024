import * as yup from 'yup';

export const validationSchema = yup.object({
  name: yup.string().required('Name must be required'),
  quantity: yup.string().required('Quantity must be required'),
  discountRate: yup.number(),
  discountAmount: yup.number(),
  status: yup.boolean().required('Status must be required'),
  type: yup.string().required('Type must be required'),
});
