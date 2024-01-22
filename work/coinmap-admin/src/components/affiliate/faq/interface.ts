export interface FAQ {
  id: string;
  type: 'FAQ';
  name: string;
  data: {
    translation: {
      vi: {
        name: string;
        answer: string;
      };
      en: {
        name: string;
        answer: string;
      };
    };
  };
  created_at: string;
  updated_at: string;
}
