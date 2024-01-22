import Script from 'next/script';
import { memo } from 'react';

interface Props {
  ggTagIds: string[];
}

const GoogleAnalytics = ({ ggTagIds }: Props) => {
  if (!ggTagIds?.length) return <></>;

  const generateGtagConfig = (tagId: string) => {
    if (!tagId) return '';
    return `gtag('config', '${tagId}', { page_path: window.location.pathname, cookie_flags: 'secure;samesite=none' });`;
  };

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${ggTagIds[0]}`}
      />
      <Script strategy="lazyOnload" id={`gg-analytics-${ggTagIds[0]}`}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${ggTagIds.reduce(
            (result, id) => result + generateGtagConfig(id),
            ''
          )}
          `}
      </Script>
    </>
  );
};

export default memo(GoogleAnalytics);
