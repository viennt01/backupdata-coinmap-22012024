import { LOCALE } from '@/constants/code-constants';

interface Feature {
  title: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
}

export type FormValues = {
  [locale in LOCALE]: {
    features: {
      feature_1: Feature;
      feature_2: Feature;
      feature_3: Feature;
    };
    steps_to_use: {
      title: {
        content: string;
      };
      step_1: Step;
      step_2: Step;
      step_3: Step;
      step_4: Step;
    };
  };
};

export interface HomePageContent {
  id: string;
  type: string;
  name: string;
  data: FormValues;
}
