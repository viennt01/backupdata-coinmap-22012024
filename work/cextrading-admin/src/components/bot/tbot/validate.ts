import * as yup from 'yup';

export const validationSchema = yup.object({
  name: yup.string().required('Name must be required'),
  code: yup.string().required('Code must be required'),
  type: yup.string().required('type must be required'),
  status: yup.string().required('status must be required'),
  price: yup
    .number()
    .typeError('price be a number')
    .required('price must be required'),
  tokenFirst: yup.string().required('Base symbol name must be required'),
  tokenSecond: yup.string().required('QuoteSymbol name must be required'),
  order: yup
    .number()
    .typeError('price be a number')
    .required('price must be required'),
  workBasedOn: yup.array().min(1, 'Requirement must be required'),
  imageUrl: yup.string().required('imageUrl must be required'),
  description: yup.string().required('description must be required'),
  pnl: yup.string().required('pnl must be required'),
  max_drawdown: yup.string().required('max_drawdown must be required'),
  balance: yup.string().required('balance must be required'),
});
