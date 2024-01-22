import { NextRouter, useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function useTabIndex(): [
  number,
  React.Dispatch<React.SetStateAction<number>>,
  NextRouter,
] {
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash) {
      setTabIndex(Number(window.location.hash.split('')[1]));
    } else {
      router.replace(`${router.asPath}#0`);
    }
  }, []);

  return [tabIndex, setTabIndex, router];
}
