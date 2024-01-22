import * as yup from 'yup';

export const validationSchema = yup.object({
  email: yup.string().email().required('Email must be required'),
  password: yup.string().required('Password must be required'),
});
