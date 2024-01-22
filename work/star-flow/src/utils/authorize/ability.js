import { DASHBOARD_CONFIG, LOCAL_CACHE_KEYS } from '@/config';
import { SETTING_IDS } from '@/config/consts/features';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { AbilityBuilder, Ability } from '@casl/ability';
import { localStore } from '@/utils/localStorage';

export const symbolToFeatureId = (symbol) => `SYMBOL_${symbol}`;

export const getUserFeatures = (user) => {
  const featuresAbilities = {}; // result
  let isRealtimeXCME = false;

  const { roles } = user;
  if (!Array.isArray(roles)) {
    return featuresAbilities;
  }

  for (let i = 0; i < roles.length; i++) {
    // 1. tách feature của từng role
    // 2. tách symbol của từng role
    // 3. join feature và symbol của từng role

    let features = [];
    let symbols = [];
    const role = roles[i];
    features = features.concat(role?.root?.features || []); // list features of role

    // GET LIST SYMBOLS FROM ROLES
    const symbolSettingsRoles = role?.root?.symbol_settings_roles;

    // get symbol name
    Object.keys(symbolSettingsRoles).forEach((roleKey) => {
      const sb = symbolSettingsRoles[roleKey]?.symbols || [];
      symbols = symbols.concat(sb);
    });

    const featureIdsMap = {};
    if (Array.isArray(features)) {
      for (let fIndex = 0; fIndex < features.length; fIndex++) {
        const ability = features[fIndex];
        if (!ability || !ability.feature_id) {
          continue;
        }

        featureIdsMap[ability.feature_id] = true;

        if (
          !isRealtimeXCME &&
          ability.feature_id.toLocaleLowerCase() === 'rt'
        ) {
          isRealtimeXCME = true;
          localStore.set(LOCAL_CACHE_KEYS.XCME_TYPE_DATA, 'rt');
        }
      }
    }
    const featureIds = Object.keys(featureIdsMap);

    symbols.forEach((symbolItem) => {
      if (!symbolItem || !symbolItem.symbol) {
        return;
      }

      const symbolFeatureId = symbolToFeatureId(symbolItem.symbol);

      if (featuresAbilities[symbolFeatureId]) {
        const currentList = {};
        currentList[PERMISSION_ACTIONS.VIEW] =
          featuresAbilities[symbolFeatureId][PERMISSION_ACTIONS.VIEW].concat(
            featureIds
          );
        const filterFeatures = currentList[PERMISSION_ACTIONS.VIEW].filter(
          (f, i) => currentList[PERMISSION_ACTIONS.VIEW].indexOf(f) === i
        );
        // join features by symbol if it was existed
        featuresAbilities[symbolFeatureId] = {
          [PERMISSION_ACTIONS.VIEW]: filterFeatures,
        };
      } else {
        const currentList = {};
        currentList[PERMISSION_ACTIONS.VIEW] = [...featureIds];
        featuresAbilities[symbolFeatureId] = currentList;
      }
    });
  }

  return featuresAbilities;
};

/**
 * @param user contains details about logged in user: its id, name, email, etc
 */
export const defineAbilitiesFor = () => {
  const { rules } = new AbilityBuilder(Ability);

  // // can read blog posts
  // can('read', 'BlogPost');
  // // can manage (i.e., do anything) own posts
  // can('manage', 'BlogPost', { author: user.id });
  // // cannot delete a post if it was created more than a day ago
  // cannot('delete', 'BlogPost', {
  //   createdAt: { $lt: Date.now() - 24 * 60 * 60 * 1000 },
  // });

  return new Ability(rules);
};

const ability = defineAbilitiesFor({});

// get limit setting of setting id, ex: LIMIT_PANEL, LIMIT_INDICATOR
const getLimitSetting = (user, settingId) => {
  let limit = 0;
  if (!Array.isArray(user.roles)) return limit;

  // find max limit of roles
  user.roles.forEach((role) => {
    const settings = role.root.general_settings;
    if (!Array.isArray(settings)) return;

    settings.forEach((setting) => {
      if (
        setting.general_setting_id === SETTING_IDS[settingId] &&
        setting.val_limit > limit
      ) {
        limit = setting.val_limit;
      }
    });
  });

  return limit;
};

export const updateAbility = (user) => {
  const { can, rules } = new AbilityBuilder(Ability);
  const featureAbilities = getUserFeatures(user);
  Object.keys(featureAbilities).forEach((featureId) => {
    const subjectAbilities = featureAbilities[featureId];
    const actions = Object.keys(subjectAbilities);

    actions.forEach((action) => {
      const actionOnFields = subjectAbilities[action];
      can(action, featureId, actionOnFields);
    });
  });

  // set panel limit
  DASHBOARD_CONFIG.LIMIT_SECTION = getLimitSetting(
    user,
    SETTING_IDS.LIMIT_PANEL
  );

  // set indicator limit
  DASHBOARD_CONFIG.LIMIT_INDICATOR = getLimitSetting(
    user,
    SETTING_IDS.LIMIT_INDICATOR
  );

  ability.update(rules);
};

export default ability;
