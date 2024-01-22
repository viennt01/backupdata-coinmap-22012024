import * as yup from 'yup';

export const validationSchema = yup.object({
  roleName: yup.string().required('Name must be required'),
  description: yup.string().required('Description must be required'),
  generalIds: yup.array().of(yup.string()),
  valueLimit: yup
    .array()
    .of(
      yup.object({
        id: yup.string(),
        value: yup.string(),
      }),
    )
    .when(['generalIds'], (generalIds, schema) => {
      if (generalIds.length > 0) {
        return schema.min(generalIds.length, 'Value must be required');
      }
      return schema;
    }),
  descriptionFeatures: yup.array().of(yup.string()),
  currency: yup.string().required('Currency must be required'),
  price: yup.string().required('Price must be required'),
  type: yup.string().required('Type must be required'),
  status: yup.string().required('Status must be required'),
});
