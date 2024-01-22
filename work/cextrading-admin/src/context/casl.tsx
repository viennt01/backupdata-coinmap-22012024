import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { defineAbility } from '@casl/ability';

export const AbilityContext = createContext<any>({});
export const Can = createContextualCan(AbilityContext.Consumer);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default defineAbility(() => {});
