import { AbilityContext } from 'context/casl';
import { useAbility } from '@casl/react';
import { PERMISSION_LIST } from 'constants/permission-id';

export default function useMyAbility() {
  const ability = useAbility(AbilityContext);
  ability.permissions = PERMISSION_LIST;

  return ability;
}
