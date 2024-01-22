import { useRouter } from 'next/router';

export enum Language {
  VN = 'vi',
  EN = 'en',
}

export default function useLocale(): Language {
  const router = useRouter();
  return (router.locale as Language) || Language.EN;
}
