export interface PackagePeriod {
  id: string;
  type: 'PKG_PERIOD';
  name: string;
  data: {
    translation: {
      vi: {
        name: string;
        quantity: number;
        discount_amount: number;
        discount_rate: number;
        type: string;
      };
      en: {
        name: string;
        quantity: number;
        discount_amount: number;
        discount_rate: number;
        type: string;
      };
    };
  };
  created_at: string;
  updated_at: string;
}
