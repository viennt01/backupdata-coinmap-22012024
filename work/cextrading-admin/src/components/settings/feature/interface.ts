import { FEATURE_ACTIONS } from 'constants/index';

export interface Feature {
  featureId: string;
  featureName: string;
  description: string;
  action: FEATURE_ACTIONS | '';
  createdAt: string;
}
