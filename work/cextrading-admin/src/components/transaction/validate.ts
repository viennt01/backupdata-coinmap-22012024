import * as yup from 'yup';

export const validationInterventionSchema = yup.object({
  message: yup.string().required('Message must be required'),
});
export const validationRefundSchema = yup.object({
  amount: yup.string().required('Amount must be required'),
  transferId: yup.string().required('Transfer id must be required'),
  description: yup.string().required('Description must be required'),
});

export const validationRepaymentSchema = yup.object({
  amount: yup.number().required('Amount must be required'),
  description: yup.string().required('Description must be required'),
});
