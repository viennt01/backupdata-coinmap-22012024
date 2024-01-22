import * as yup from 'yup';

export const validationSchema = yup.object({
  phone: yup.string().matches(/(84|0|[+]+84)+([0-9]{9})\b/, {
    message: 'Format is invalid',
    excludeEmptyString: true,
  }),
  firstName: yup.string(),
  lastName: yup.string(),
  address: yup.string(),
  affiliateCode: yup.string(),
  // .required('AffiliateCode must be required'),
  linkAffiliate: yup.string(),
  // .required('LinkAffiliate must be required'),
  referralCode: yup.string(),
  // .required('referralCode must be required'),
  profilePic: yup.string(),
  // .required('Avatar must be required'),
  noteUpdated: yup.string(),
  // .required('Note must be required'),
  email: yup
    .string()
    .email('Email is invalid')
    .required('Email must be required'),
  isAdmin: yup.boolean(),
  // .required('Name must be required'),
  active: yup.boolean(),
  // .required('Name must be required'),
  roleIds: yup
    .array()
    .of(yup.string().required('Role must be required'))
    .min(1, 'Role must be required'),
});
