import * as yup from 'yup';

export const validationSchema = yup.object({
  firstName: yup.string().required('Name must be required'),
  lastName: yup.string().required('Name must be required'),
  email: yup
    .string()
    .email('Invalid format')
    .required('Email must be required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
    )
    .required('Password must be required'),
  repeatPassword: yup
    .string()
    .required('Password must be required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  confirmRule: yup.boolean().oneOf([true], 'Field must be checked'),
});
