import * as yup from 'yup';

export const validationSchema = yup.object({
  symbol: yup.string().required('Name must be required'),
  types: yup.string().required('Display name must be required'),
  exchangeName: yup.string().required('Exchange name must be required'),
  baseSymbol: yup.string().required('Base symbol name must be required'),
  quoteSymbol: yup.string().required('Quote symbol must be required'),
  description: yup.string().required('Description must be required'),
  ticks: yup.object({
    tickvalue: yup
      .number()
      .typeError('Value must be required')
      .min(0, 'Invalid')
      .required('Value must be required'),
    tickvalueHeatmap: yup
      .number()
      .typeError('Value must be required')
      .min(0, 'Invalid')
      .required('Value must be required'),
  }),
});
