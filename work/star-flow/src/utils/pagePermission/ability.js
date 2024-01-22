import { AbilityBuilder, Ability } from '@casl/ability';

export const PATHNAME_TO_ID = {};

export const defineAbilitiesFor = () => {
  const { rules } = new AbilityBuilder(Ability);
  return new Ability(rules);
};

const pageAbility = defineAbilitiesFor();

export const updatePageAbility = (permission) => {
  const { can, rules } = new AbilityBuilder(Ability);

  permission?.pages.forEach(({ action, id, pathname }) => {
    can(action, id);
    PATHNAME_TO_ID[pathname] = id;
  });

  permission?.features.forEach(({ action, id }) => {
    can(action, id);
  });

  pageAbility.update(rules);
};

export default pageAbility;
