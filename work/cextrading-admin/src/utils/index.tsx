import { useCallback } from 'react';

export const useYupValidationResolver = <T,>(validationSchema: any) =>
  useCallback(
    async (data: T) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [validationSchema],
  );

export const myLocalStorage = {
  get(name: string) {
    const value = localStorage.getItem(name);
    return value;
  },
  set(name: string, value: string) {
    localStorage.setItem(name, value);
  },
  delete(name: string) {
    localStorage.removeItem(name);
  },
};

export function isNotEmpty(data: any): boolean {
  if (data === undefined || data === null || data === '') {
    return false;
  }
  return true;
}
