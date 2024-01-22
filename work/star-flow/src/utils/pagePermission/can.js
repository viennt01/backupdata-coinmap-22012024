import { createContext } from 'react';
import { createContextualCan } from '@casl/react';

export const PageAbilityContext = createContext();
export const Can = createContextualCan(PageAbilityContext.Consumer);
