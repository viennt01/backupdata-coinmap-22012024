import { isNotEmpty } from 'utils';
import * as yup from 'yup';
import { TypeValue } from './interface';

export const validationSchema = yup.object({
  name: yup.string().required('Name must be required'),
  params: yup.object().required('Params must be required'),
});

export function dataValid(data: any, type: TypeValue): boolean {
  if (
    type === TypeValue.TEXT ||
    type === TypeValue.BOOLEAN ||
    type === TypeValue.NUMBER
  ) {
    return isNotEmpty(data);
  }
  try {
    const value = JSON.parse(data);
    if (type === TypeValue.ARRAY && !value.length) {
      return false;
    }
    if (
      type === TypeValue.OBJECT &&
      (typeof value !== 'object' || value.length)
    ) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}
