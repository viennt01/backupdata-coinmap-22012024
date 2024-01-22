import * as yup from 'yup';

export const validationSchema = yup.object({
  generalSettingId: yup.string().required('Id must be required'),
  generalSettingName: yup.string().required('Name must be required'),
  description: yup.string().required('Description must be required'),
});
